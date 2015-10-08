var args = arguments[0] || {};

var dados = args.dados;

getListaFrete();	

args.pai.on("change", function(e){
	getListaFrete();
});

function sucesso(){
	try{
		$.fretes.trigger("change");
		if($.fretes.length == 0){
			var lblEmpty = Ti.UI.createLabel({
				text: "Não existe nenhum frete neste período/fase",
				wordWrap: true,
				font: {fontSize: 16},
				width: "90%",
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
			});
			$.boxFrete.remove($.minhaListaFrete);
			$.boxFrete.add(lblEmpty);
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/AprovacaoPagamento/ListaQuemAprovou.js");
	}
}

function getListaFrete(){
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucesso,
		error: function(e){
			alert("Erro ao tentar obter a lista de frete");
		},
		url:  Alloy.Globals.MainDomain + "api/controleaplicacaomassas/getListFrete", 
		metodo: "POST", 
		timeout: 120000,
		colecao: $.fretes
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
		md.Motorista = "Motorista: " + md.Motorista;
		md.Toneladas = "Carga acumulada: " + md.Toneladas + "ton";
		md.Viagens = "Nº viagens: " + md.Viagens;
		md.MediaToneladasViagem = "Média de carga: " + md.MediaToneladasViagem + "ton";
		md.ValorBruto = "Valor bruto: " + Alloy.Globals.format.paraReal(md.ValorBruto, ".");
		return md;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "formatar", "app/controllers/AprovacaoPagamento/ListaQuemAprovou.js");
	}
}