var args = arguments[0] || {};

var dados = args.dados;

var resumo = Alloy.createCollection("Resumo");

getResumo();	

args.pai.on("change", function(e){
	getResumo();
});

function sucesso(){
	try{
		resumo.trigger("change");
		var mdResumo = resumo.at(0).toJSON();
		$.CargaAcumulada.text = "Carga acumulada: " + mdResumo.CargaAcumulada + "ton";
		$.EspessuraMedia.text = "Espessura média: " + mdResumo.EspessuraMedia + "cm";
		$.AreaTotal.text = "Área total: " + mdResumo.AreaTotal + "m²";
		$.QuantidadeCaminhoes.text = "Quantidade de viagens: " + mdResumo.QuantidadeCaminhoes;
		$.ValorTonelada.text = "Valor do frete por tonelada: " + Alloy.Globals.format.paraReal(mdResumo.ValorTonelada, ".");
		$.ValorTotalBrutoFrete.text = "Valor bruto do frete: " + Alloy.Globals.format.paraReal(mdResumo.ValorTotalBrutoFrete, ".");
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/AprovacaoPagamento/ListaQuemAprovou.js");
	}
}

function getResumo(){
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucesso,
		error: function(e){
			alert("Erro ao tentar obter o resumo");
		},
		url:  Alloy.Globals.MainDomain + "api/controleaplicacaomassas/getResumo", 
		metodo: "POST", 
		timeout: 120000, 
		colecao: resumo
	});
	if(ws){
		ws.adicionaParametro({PeriodoInicial: args.pai.getPeriodoInicial(), 
			PeriodoFinal: args.pai.getPeriodoFinal(), 
			Fase_id: args.pai.getFaseId()});
		ws.NovoEnvia();
	}	
}