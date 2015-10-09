var args = arguments[0] || {};

$.init = function(parans){
	Alloy.Globals.configWindow($.winPatologia, $);
	$.minhaTopBar.iniciar("Patologia");
	$.minhaTopBar.addRightButtom("/images/aprova.png", checkSave);
	$.observacao.init({nome: "Observacao"});
};

function checkSave(e){
	var check = Alloy.createWidget("GUI", "Mensagem");
	
	if($.observacao.getInputValue() == ""){
		check.init("Alerta", "A observação é obrigatória.");
		check.show({callback: $.observacao.selecionar});
		return;
	}
	
	var check = Alloy.createWidget("GUI", "Mensagem");
	check.init("Alerta", "Confirma o envio dessa patologia ?", true);
	check.show({callback: enviarPatologia});
}

function pegaPatologia(){
	Alloy.Globals.Camera.tiraFoto({
		callback: pegaImagem,
		erro: function(e){ Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao obter a imagem. Descrição: " + error.code); }
	});
}

function pegaImagem(evt){
	Alloy.Globals.carregando();
	Alloy.Globals.GPS.pegaPosicaoAtual(montaImagemPatologia, evt, erroGPS);
}

function erroGPS(parans){
	Alloy.Globals.Alerta("Erro", parans.mensagem);
}

function montaImagemPatologia(evt, coords){
	var relacaoLargura = 1;
	var relacaoAltura = 1;
	
	if(evt.media.getWidth() > evt.media.getHeight()){
		relacaoAltura = 0.6;
	}else if(evt.media.getWidth() < evt.media.getHeight()){
		relacaoLargura = 0.6;
	}
	
	var altura = 1000 * relacaoAltura;
	var largura = 1000 * relacaoLargura;
	
	var viewImage = Ti.UI.createView({
		width: largura,
		height: altura
	});
	
	var imgViewAux = Ti.UI.createImageView({
		image: evt.media.imageAsResized(largura, altura),
		width: largura,
		height: altura
	});
	
	viewImage.add(imgViewAux);
	
	var viewInfoAux = Ti.UI.createView({
		layout: 'vertical',
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		bottom: 10
	});
	viewImage.add(viewInfoAux);
	
	var dataLabel = Ti.UI.createLabel({
		font: {fontSize: 16},
		color: "white",
		text: Alloy.Globals.format.customFormatData(new Date(), undefined, "YYYY-MM-DD"),
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
	});
	viewInfoAux.add(dataLabel);
	
	var horaLabel = Ti.UI.createLabel({
		font: {fontSize: 16},
		color: "white",
		text: Alloy.Globals.format.customFormatData(new Date(), undefined, "HH:mm:ss"),
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
	});
	viewInfoAux.add(dataLabel);
	
	var latitudeLabel = Ti.UI.createLabel({
		font: {fontSize: 16},
		color: "white",
		text: coords.latitude,
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
	});
	viewInfoAux.add(latitudeLabel);
	
	var longitudeLabel = Ti.UI.createLabel({
		font: {fontSize: 16},
		color: "white",
		text: coords.longitude,
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
	});
	viewInfoAux.add(longitudeLabel);
	
	$.currentImage.setImage(viewImage.toImage());
	
	Alloy.Globals.carregou();
}

function enviarPatologia(){
	
	var patologias = [];
	
	patologias.push({
		Data: Alloy.Globals.format.customFormatData(new Date(), undefined, "YYYY-MM-DD HH:mm:ss"),
		Latitude: "-16.6868824",
		Longitude: "-49.2647885",
		Imagem: Ti.Utils.base64encode($.currentImage.image).text
	});
	
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucessEnviarPatologia,
		error: failEnviarPatologia,
		url:  Alloy.Globals.MainDomain + "api/patologias/criaPatologia", 
		metodo: "POST", 
		timeout: 120000
	});
	if(ws){
		ws.adicionaParametro({
			Obra_id: Alloy.Globals.Obra.id,
			usuarioId: Alloy.Globals.Cliente.at(0).get("id"),
			Observacao: $.observacao.getInputValue(),
			patologias: patologias
		});
		ws.NovoEnvia();
	}
}

function sucessEnviarPatologia(ret){
	var res = ret.at(0).toJSON();
	if(res.sucesso){
		var check = Alloy.createWidget("GUI", "Mensagem");
		check.init("Sucesso", "Abastecimento enviado com sucesso !");
		check.show({callback: voltar});
	}else{
		Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao inserir a patologia: descrição: " + res.mensagem);
	}
}

function failEnviarPatologia(ret){
	Alloy.Globals.Alerta("Erro", "Erro ao enviar a patologia. descricao: " + ret.error);
}

function voltar(){
	Alloy.Globals.Transicao.anterior();
	args.pai.callRefresh();
}
