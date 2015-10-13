var args = arguments[0] || {};

$.lblBemVindo.setText("Bem-vindo " + Alloy.Globals.Cliente.at(0).get("nome") + " " + Alloy.Globals.Cliente.at(0).get("sobrenome"));

$.obra.on("change", habilitaBotoes);

var obras = Alloy.createCollection("Obra");

obras.fetch();

var chaves = ["id"];

$.init = function(args){
	Alloy.Globals.configWindow($.winPrincipal, $);
	$.minhaTopBar.iniciar("Britec Coletor");
	$.minhaTopBar.desabilitarServicos();
	$.obra.init({nome: "Obras", colecao: obras, chave: chaves, coluna: "descricao"});
	if(Alloy.Globals.Obra != null){
		initBotoes({});
	}
};

function obtemListaObra(e){
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucessListaObra,
		error: failListaObra,
		url:  Alloy.Globals.MainDomain + "api/obras/getObrasUsuario", 
		metodo: "POST", 
		timeout: 120000,
		colecao: obras
	});
	if(ws){
		Ti.API.info(JSON.stringify({usuarioId: Alloy.Globals.Cliente.at(0).get("id")}));
		ws.adicionaParametro({usuarioId: Alloy.Globals.Cliente.at(0).get("id")});
		ws.NovoEnvia();
	}
}

$.winPrincipal.addEventListener("open", function(e){
	obtemListaObra();
});

function sucessListaObra(ret){
	obras.trigger("change");
}

function failListaObra(ret){
	Alloy.Globals.Alerta("Erro", "Erro ao sincronizar os dados. descricao: " + ret.error);
}

function habilitaBotoes(e){
	if(e != undefined){
		var lclObras = obras.where({id: e.chave[0]});
		if(lclObras.length > 0){
			Alloy.Globals.Obra = lclObras[0].toJSON();	
		}
		$.minhaTopBar.habilitarServicos();
		$.btnCtrlAplic.setEnabled(true);
		$.btnCtrlAbs.setEnabled(true);
		$.btnCtrlPat.setEnabled(true);
	}else{
		$.btnCtrlAplic.setEnabled(false);
		$.btnCtrlAbs.setEnabled(false);
		$.btnCtrlPat.setEnabled(false);
		Alloy.Globals.Obra = null;
	}
}

function initBotoes(){
	$.obra.setSelected(Alloy.Globals.Obra.descricao, [Alloy.Globals.Obra.id]);
}

function contrAplc(e){
	var novo = Alloy.createController("Aplicacao/ControleDeAplicacao");
	Alloy.createWidget("Util", "Transicao").nova(novo, novo.init, {});
}

function contrAbast(e){
	var novo = Alloy.createController("Abastecimento/ListaAbastecimento");
	Alloy.createWidget("Util", "Transicao").nova(novo, novo.init, {});
}

function contrPat(e){
	var novo = Alloy.createController("Patologia/ListaPatologia");
	Alloy.createWidget("Util", "Transicao").nova(novo, novo.init, {});
}