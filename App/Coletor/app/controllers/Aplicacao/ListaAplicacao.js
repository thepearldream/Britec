var args = arguments[0] || {};

var dados = args.dados;

getListaAplicacao();	

args.pai.on("change", function(e){
	getListaAplicacao();
});

var lblEmpty = Ti.UI.createLabel({
	text: "Não existe nenhuma aplicação neste período/fase",
	wordWrap: true,
	font: {fontSize: 16},
	width: "90%",
	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
});

var vazia = false;

function sucesso(){
	try{
		$.aplicacoes.trigger("change");
		if($.aplicacoes.length == 0 && !vazia){
			vazia = true;
			$.minhaListaAplicacao.setVisible(false);
			$.boxAplicacao.add(lblEmpty);
		}else if(vazia){
			vazia = false;
			$.minhaListaAplicacao.setVisible(true);
			$.boxAplicacao.remove(lblEmpty);
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/AprovacaoPagamento/ListaQuemAprovou.js");
	}
}

function getListaAplicacao(){
	var parans = {
		PeriodoInicial: args.pai.getPeriodoInicial(), 
		PeriodoFinal: args.pai.getPeriodoFinal(), 
		Fase_id: args.pai.getFaseId(), 
		Obra_id: Alloy.Globals.Obra.id
	};
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucesso,
		error: function(e){
			alert("Erro ao tentar obter a lista de aplicações");
		},
		url:  Alloy.Globals.MainDomain + "api/controleaplicacaomassas/getListAplicacao", 
		metodo: "POST", 
		timeout: 120000,
		colecao: $.aplicacoes,
		offSync: {
			tipo: Alloy.Globals.tipoSincronizacao.RECEBENDO,
			parans: parans,
			modelName: "AplicacaoMassa",
			paransConfig: {
				PeriodoInicial: {operator: ">=", column: "data"}, 
				PeriodoFinal: {operator: "<=", column: "data"},
				orderBy: " Order by Nota",
				ignore: ["Obra_id"]
			}
		}
	});
	if(ws){
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