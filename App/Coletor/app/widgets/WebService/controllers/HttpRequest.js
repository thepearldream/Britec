/**
 * @class widgets.WebService.HttpRequest
 * @private
 * Faz solicitações http.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property
 * @private
 * Url do serviço.
 * @type {String}
 */
var url = args.url;
/**
 * @property
 * @private
 * Time out da requisição.
 * @type {Number}
 */
var timeout = args.timeout;
/**
 * @property
 * @private
 * GET ou POST.
 * @type {widgets.GUI.Camada}
 */
var metodo = args.metodo;
/**
 * @property
 * @private
 * Função executada caso a requisição seja bem-sucedida.
 * @type {Function}
 */
var sucessCallback = args.callback || function(e){alert('Sucesso');};
/**
 * @property
 * @private
 * Função executada caso ocorra erro na requisição.
 * @type {Function}
 */
var errorCallback = args.error || function(e){alert('error');};
/**
 * @property
 * @private
 * Caso seja passada como parâmetro, a mesma é populada com os dados obtidos pela requisição. Caso não seja passada uma nova coleção é criada.
 * @type {BackBone.Collection}
 */
var colecao = args.colecao || null;
/**
 * @property
 * @private
 * Caso a classe crie uma nova coleção, essa configuração será usada na nova BackBone.Collection.
 * @type {BackBone.Options}
 */
var collectionConfig = args.colletionConfig || {};
/**
 * @property
 * @private
 * Armazena os dados que serão enviados pela requisição.
 * @type {Object}
 */
var dados = null;

var offSync = args.offSync;

/**
 * @method 
 * Adiciona os dados que serão enviados pela requisição.
 * @param {JSONObject} parametro
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.adicionaParametro = function(parametro){
	dados = parametro;	
};

/**
 * @method
 * Executa a requisição.
 * Ao final da requisição, as funções de sucessCallback ou errorCallback serão ativadas.
 * Caso a função de sucessCallback seja executada, a coleção gerada ou populada será passada como parâmetro.
 * Caso a função de errorCallback seja executada, o erro é retornado como parâmetro.
 * @param {JSONObject} parans Configurações da requisição.
 * @param {Boolean} parans.outArch Indica se o webService está fora da arquitetura mobile WebAPI
 * @returns {null} 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.NovoEnvia = function(parans){
	try{
		var client = Ti.Network.createHTTPClient({
		    onload : function(e){
		    	if(this.responseText == null){
		    		sucessCallback();
		    		return ;
		    	}
		    	var jsonText = this.responseText;
				var json = JSON.parse(jsonText);
				if(offSync != undefined){
					if(offSync.tipo == Alloy.Globals.tipoSincronizacao.ENVIANDO){
						if(json.sucesso){
							offSync.model.set(json.dados);
							errorOffSync(true);	
						}else{
							colecao = Alloy.Globals.DAL.criarColecao(json, collectionConfig);
						}
					}else if(offSync.tipo == Alloy.Globals.tipoSincronizacao.RECEBENDO){
						if(colecao){
							Alloy.Globals.DAL.saveColecao(colecao, json, offSync);
							Alloy.Globals.DAL.refreshColecao(colecao, json);
						}else{
							recursiveSaveCol(offSync, json);
							colecao = Alloy.Globals.DAL.criarColecao(json, collectionConfig);
						}
					}
				}
				else if(colecao && offSync == undefined){
					Alloy.Globals.DAL.refreshColecao(colecao, json);	
				}
				else{
					colecao = Alloy.Globals.DAL.criarColecao(json, collectionConfig);
				}
		    	sucessCallback(colecao);
		    },
		    onerror : function(e){
		    	if(offSync){
					errorOffSync(false);
				}else{
					errorCallback(e);	
				}
		    },
		    timeout : args.timeout
		});
		
		if(offSync != undefined && !Alloy.Globals.estaOnline){
			errorOffSync(false);
		}
		Envia(client);	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "NovoEnvia", "app/widgets/WebService/controllers/HttpRequest.js");
	}
};

function errorOffSync(sync){
	if(offSync.tipo == Alloy.Globals.tipoSincronizacao.RECEBENDO){
		if(colecao){
			colecao.fetch({query: getQueryOffSync(offSync)});
			sucessCallback(colecao);
		}else{
			if(offSync.nestedAttribute == undefined || offSync.modelName == undefined) {
			    console.error('Para objetos simples passe a referencia da coleção pelo parâmetro "colecao". No caso de solicitações com objetos encadeados é necessário passar o nome da coleção.');
			    return ;
			}
			var colAux = Alloy.createCollection(offSync.modelName);
			colAux.fetch({query: getQueryOffSync(offSync)});
			var lstAux = colAux.toJSON();
			getNestedCol(offSync.nestedAttribute, lstAux);
			colecao = Alloy.Globals.DAL.criarColecao(lstAux, {});
			sucessCallback(colecao);
		}
	}else if(offSync.tipo == Alloy.Globals.tipoSincronizacao.ENVIANDO){
		var mdAux = offSync.model.toJSON();
		if(offSync.nestedAttribute != undefined){
			saveNestedAttribute(offSync.nestedAttribute, objAux, sync);	
		}
		mdAux._sincronizado = sync;
		mdAux._editado = false;
		var mdPersist = Alloy.createModel(offSync.modelName, mdAux);
		mdPersist.save();
		sucessCallback(offSync.model);
	}
	return null;
}

function saveNestedAttribute(nestedAttribute, mdAux, sync){
	for(var i = 0; i < nestedAttribute.length; i++){
		var objAux = mdAux[nestedAttribute[i].attribute];
		if(nestedAttribute[i].nestedAttribute != undefined){
			saveNestedAttribute(nestedAttribute[i].nestedAttribute, objAux, sync);
		}
		while(mdAux[nestedAttribute[i].attribute].length > 0){
			objAux[0]._sincronizado = sync;
			objAux[0]._editado = false;
			var mdNested = Alloy.createModel(nestedAttribute[i].modelName, objAux[0]);
			mdNested.save();
			//delete mdAux[nestedAttribute[i].attribute][0];	
		}
	}
	return ;
}

function getQueryOffSync(itOffSync){
	var strQuery = "";
	var strFiltro = "";
	for(filtro in itOffSync.parans){
		if(itOffSync.paransConfig.ignore != undefined){
			if(itOffSync.paransConfig.ignore.indexOf(filtro) >= 0){
				continue;
			}
		}
		if(itOffSync.parans[filtro] != null){
			strFiltro += " " + 
				(itOffSync.paransConfig[filtro].column==undefined?filtro:itOffSync.paransConfig[filtro].column) + " " + 
				(itOffSync.paransConfig[filtro]!=undefined?itOffSync.paransConfig[filtro].operator:"=") + " " + 
				(isNaN(itOffSync.parans[filtro])?"'" + itOffSync.parans[filtro] + "'":itOffSync.parans[filtro]) + " and ";	
		}
	}
	strFiltro = strFiltro.substr(0, (strFiltro.length - 5));
	strQuery = "select * from " + itOffSync.modelName + " where " + strFiltro + " " + itOffSync.paransConfig.orderBy;
	return strQuery;
}

function getNestedCol(nestedAttribute, objCol){
	for(var i = 0; i < nestedAttribute.length; i++){
		for(var j = 0; j < objCol.length; j++){
			var objCol = Alloy.createCollection(nestedAttribute[i].modelName);
			objCol.fetch({query: "Select * from " + nestedAttribute[i].modelName + " where " + nestedAttribute[i].FK + " = " + objCol[j][nestedAttribute[i].PK]});
			objCol[j][nestedAttribute[i].attribute] = objCol.toJSON();
			if(nestedAttribute[i].nestedAttribute != undefined){
				getNestedCol(nestedAttribute[i].nestedAttribute, objCol[j][nestedAttribute[i].attribute]);
			}
		}
	}
	return ;
}

function recursiveSaveCol(itOffSync, json){
	for(dado in json){
		if(itOffSync.nestedAttribute != undefined){
			for(offSyncDados in itOffSync.nestedAttribute){
				recursiveSaveCol(offSyncDados, dado[offSyncDados.attribute]);
			}
		}
		var md = Alloy.createModel(itOffSync.modelName, dado);
		md.save();
	}
}

function Envia(cliente){
	cliente.open(metodo, url);
	cliente.setRequestHeader("Content-Type","application/json");
	if(offSync == undefined){
		cliente.send(JSON.stringify(dados));
	}else{
		if(offSync.tipo == Alloy.Globals.tipoSincronizacao.RECEBENDO){
			cliente.send(JSON.stringify(offSync.parans));
		}else if(offSync.tipo == Alloy.Globals.tipoSincronizacao.ENVIANDO){
			cliente.send(JSON.stringify(offSync.model.toJSON()));
		}
	}
}