var args = arguments[0] || {};

var btnAdd = null;

$.init = function(args){
	Alloy.Globals.configWindow($.winListaAbastecimento, $);
	$.minhaTopBar.iniciar("Contr. de abastec.");
	btnAdd = $.minhaTopBar.addRightButtom("/images/add_white.png", add);
};

var lblEmpty = Ti.UI.createLabel({
	text: "Não existe nenhum abastecimento nesta obra",
	wordWrap: true,
	font: {fontSize: 16},
	width: "90%",
	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
});

var vazia = false;

function sucesso(){
	try{
		$.abastecimentos.trigger("change");
		if($.abastecimentos.length == 0 && !vazia){
			vazia = true;
			$.minhaListaAbastecimento.setVisible(false);
			$.mestre.add(lblEmpty);
		}else if(vazia){
			vazia = false;
			$.minhaListaAbastecimento.setVisible(true);
			$.mestre.remove(lblEmpty);
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