var args = arguments[0] || {};

var dados = args.dados;

getListaAplicacao();	

args.pai.on("change", function(e){
	getListaAplicacao();
});

function sucesso(){
	try{
		$.aplicacoes.trigger("change");
		if($.aplicacoes.length == 0){
			var lblEmpty = Ti.UI.createLabel({
				text: "Não existe nenhuma aplicação neste período/fase",
				wordWrap: true,
				font: {fontSize: 16},
				width: "90%",
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
			});
			$.boxAplicacao.remove($.minhaListaAplicacao);
			$.boxAplicacao.add(lblEmpty);
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/AprovacaoPagamento/ListaQuemAprovou.js");
	}
}

function getListaAplicacao(){
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucesso,
		error: function(e){
			alert("Erro ao tentar obter a lista de aplicações");
		},
		url:  Alloy.Globals.MainDomain + "api/controleaplicacaomassas/getListAplicacao", 
		metodo: "POST", 
		timeout: 120000,
		colecao: $.aplicacoes
	});
	if(ws){
		ws.adicionaParametro({PeriodoInicial: args.pai.getPeriodoInicial(), 
			PeriodoFinal: args.pai.getPeriodoFinal(), 
			Fase_id: args.pai.getFaseId()});
		ws.NovoEnvia();
	}	
}


function formatar(model){
	try{
		var md = model.toJSON();
		md.Nota = "Nota: " + md.Nota;
		md.Estaca = "Estaca: " + md.Estaca;
		md.HoraInicio = "Início da aplic.: " + Alloy.Globals.format.customFormatData(md.HoraInicio, undefined, "DD/MM/YYYY HH:mm:ss");
		md.HoraFim = "Fim da aplic.: " + Alloy.Globals.format.customFormatData(md.HoraFim, undefined, "DD/MM/YYYY HH:mm:ss");
		md.Espessura = "Espessura: " + md.Espessura + "cm";
		md.Toneladas = "Carga: " + md.Toneladas + "ton";
		return md;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "formatar", "app/controllers/AprovacaoPagamento/ListaQuemAprovou.js");
	}
}