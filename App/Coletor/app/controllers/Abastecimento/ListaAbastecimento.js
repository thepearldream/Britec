var args = arguments[0] || {};

var btnAdd = null;

$.init = function(args){
	Alloy.Globals.configWindow($.winListaAbastecimento, $);
	$.minhaTopBar.iniciar("Contr. de abastec.");
	btnAdd = $.minhaTopBar.addRightButtom("/images/add.png", add);
};

function sucesso(){
	try{
		$.abastecimentos.trigger("change");
		if($.abastecimentos.length == 0){
			var lblEmpty = Ti.UI.createLabel({
				text: "Não existe nenhum abastecimento nesta obra",
				wordWrap: true,
				font: {fontSize: 16},
				width: "90%",
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
			});
			$.mestre.remove($.minhaListaAbastecimento);
			$.mestre.add(lblEmpty);
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/AprovacaoPagamento/ListaQuemAprovou.js");
	}
}

$.winListaAbastecimento.addEventListener("open", function(e){
	getListaAbastecimentos();
});

function getListaAbastecimentos(){
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucesso,
		error: function(e){
			Alloy.Globals.Alerta("Erro", "Erro ao tentar obter a lista de abastecimentos");
		},
		url:  Alloy.Globals.MainDomain + "api/abastecimentoes/getAbastecimentos", 
		metodo: "POST", 
		timeout: 120000,
		colecao: $.abastecimentos
	});
	if(ws){
		ws.adicionaParametro({Obra_id: Alloy.Globals.Obra.id});
		ws.NovoEnvia();
	}	
}

$.callRefresh = function(){
	getListaAbastecimentos();
};

function formatar(model){
	var md = model.toJSON();
	md.DataAbastecimento = "Data: " + Alloy.Globals.format.customFormatData(md.DataAbastecimento, undefined, "DD/MM/YYYY");
	md.Placa = "Veículo: " + md.Placa;
	md.DescricaoEquipamento = "Equipamento: " + md.DescricaoEquipamento;
	return md;
}

function add(e){
	var abastecimento = Alloy.createController("Abastecimento/Abastecimento", {pai: $});
	Alloy.Globals.Transicao.proximo(abastecimento, abastecimento.init, {});
}