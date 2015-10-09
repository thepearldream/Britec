var args = arguments[0] || {};

var btnAdd = null;

$.init = function(args){
	Alloy.Globals.configWindow($.winListaPatologia, $);
	$.minhaTopBar.iniciar("Contr. de patolog.");
	btnAdd = $.minhaTopBar.addRightButtom("/images/add.png", add);
};

var lblEmpty = Ti.UI.createLabel({
	text: "Não existe nenhuma patologia nesta obra",
	wordWrap: true,
	font: {fontSize: 16},
	width: "90%",
	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
});

var vazia = false;

function sucesso(){
	try{
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
		timeout: 120000,
		colecao: $.patologias
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
	md.Data = "Data: " + Alloy.Globals.format.customFormatData(md.Data, undefined, "DD/MM/YYYY");
	md.DescObra = "Obra: " + md.DescObra;
	return md;
}

function add(e){
	var patologia = Alloy.createController("Patologia/Patologia", {pai: $});
	Alloy.Globals.Transicao.proximo(patologia, patologia.init, {});
}