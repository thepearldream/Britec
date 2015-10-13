var args = arguments[0] || {};

var btnAdd = null;

$.init = function(args){
	Alloy.Globals.configWindow($.winListaPatologia, $);
	$.minhaTopBar.iniciar("Contr. de Não Confor.");
	btnAdd = $.minhaTopBar.addRightButtom("/images/add_white.png", add);
};

var lblEmpty = Ti.UI.createLabel({
	text: "Não existe nenhuma patologia nesta obra",
	wordWrap: true,
	font: {fontSize: 16},
	width: "90%",
	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
});

var vazia = false;

function sucesso(ret){
	try{
		preencheDadosPatologia(ret.toJSON());
		$.patologias.trigger("change");
		if($.patologias.length == 0 && !vazia){
			vazia = true;
			$.minhaListaPatologia.setVisible(false);
			$.mestre.add(lblEmpty);
		}else if(vazia){
			vazia = false;
			$.minhaListaPatologia.setVisible(true);
			$.mestre.remove(lblEmpty);
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/AprovacaoPagamento/ListaQuemAprovou.js");
	}
}

function preencheDadosPatologia(dados){
	for(var i = 0; i < dados.length; i++){
		var mdPatologia = Alloy.createModel("InfoPatologia", {
			Id: dados[i].Id,
			Obra_id: dados[i].Obra_id,
			Observacao: dados[i].Observacao
		});
		mdPatologia.save();
		$.patologias.add(mdPatologia, {silent: true});
		for(var j = 0; j < dados[i].imagens.length; j++){
			var mdImagemPatologia = Alloy.createModel("InfoImagemPatologia",{
				Id: dados[i].imagens[j].Id,
			    Patologia_id: dados[i].imagens[j].Patologia_id,
			    Imagem: dados[i].imagens[j].Imagem,
			    Data: dados[i].imagens[j].Data,
			    Latitude: dados[i].imagens[j].Latitude,
			    Longitude: dados[i].imagens[j].Longitude
			});
			mdImagemPatologia.save();
		}
	}
}

$.winListaPatologia.addEventListener("open", function(e){
	getListaPatologias();
});

function getListaPatologias(){
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucesso,
		error: function(e){
			Alloy.Globals.Alerta("Erro", "Erro ao tentar obter a lista de abastecimentos");
		},
		url:  Alloy.Globals.MainDomain + "api/patologias/getListPatologia", 
		metodo: "POST", 
		timeout: 120000
	});
	if(ws){
		ws.adicionaParametro({Obra_id: Alloy.Globals.Obra.id});
		ws.NovoEnvia();
	}	
}

$.callRefresh = function(){
	getListaPatologias();
};

function formatar(model){
	var md = model.toJSON();
	md.LblNumero = "Número: " + md.Id;
	md.Observacao = "Observação: " + md.Observacao;
	return md;
}

function detalhar(e){
	Ti.API.info(JSON.stringify(e.row));
	var row = e.row;
	var patologia = $.patologias.where({Id: row.modelo})[0];
	var patologia = Alloy.createController("Patologia/Patologia", {pai: $, edit: true, patologia: patologia.toJSON()});
	Alloy.Globals.Transicao.proximo(patologia, patologia.init, {});
}

function add(e){
	var patologia = Alloy.createController("Patologia/Patologia", {pai: $});
	Alloy.Globals.Transicao.proximo(patologia, patologia.init, {});
}