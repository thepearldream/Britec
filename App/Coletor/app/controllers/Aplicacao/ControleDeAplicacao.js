var args = arguments[0] || {};

var fasesObra = Alloy.createCollection("InfoFaseDaObra");

fasesObra.fetch();

var chaves = ["Id"];

$.init = function(args){
	Alloy.Globals.configWindow($.winControleAplicacao, $);
	$.minhaTopBar.iniciar("Controle de aplicação de massa");
	$.periodoInicial.init({nome: "Data inicial da aplicação"});
	//$.periodoInicial.setSelected({valor: new Date()});
	$.periodoFinal.init({nome: "Data final da aplicação"});
	//$.periodoFinal.setSelected({valor: new Date()});
	$.faseobra.init({nome: "Fases da obra", colecao: obras, chave: chaves, coluna: "Descricao"});
};

function obtemFasesObra(e){
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucessFasesObra,
		error: failFasesObra,
		url:  Alloy.Globals.MainDomain + "api/obras/getFasesDaObra", 
		metodo: "POST", 
		timeout: 120000,
		colecao: fasesObra
	});
	if(ws){
		ws.adicionaParametro({Obra_id: Alloy.Globals.Obra.id});
		ws.NovoEnvia();
	}
}

$.winControleAplicacao.addEventListener("open", function(e){
	//obtemFasesObra();
});

function sucessFasesObra(ret){
	fasesObra.trigger("change");
}

function failFasesObra(ret){
	Alloy.Globals.Alerta("Erro", "Erro ao sincronizar os dados. descricao: " + ret.error);
}