var args = arguments[0] || {};

$.lblBemVindo.setText("Bem-vindo " + Alloy.Globals.Cliente.at(0).get("nome") + " " + Alloy.Globals.Cliente.at(0).get("sobrenome"));

$.obra.on("change", habilitaBotoes);

var obras = Alloy.createCollection("Obra");

obras.fetch();

var chaves = ["id"];

if(Alloy.Globals.Obra != null){
	habilitaBotoes({chave: [Alloy.Globals.Obra.id], text: Alloy.Globals.Obra.descricao});
}

$.init = function(args){
	Alloy.Globals.configWindow($.winPrincipal, $);
	$.minhaTopBar.iniciar("Britec Coletor");
	$.obra.init({nome: "Obras", colecao: obras, chave: chaves, coluna: "descricao"});
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
		Alloy.Globals.Obra = obras.where({id: e.chave[0]})[0].toJSON();
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

function contrAplc(e){
	var novo = Alloy.createController("Aplicacao/ControleDeAplicacao");
	Alloy.Globals.Transicao.nova(novo, novo.init, {});
}
