var args = arguments[0] || {};

var imagemAtual = null;

var lstImagens = [];

var btnEnvia = null;

$.init = function(parans){
	Alloy.Globals.configWindow($.winPatologia, $);
	$.minhaTopBar.iniciar("Não Conformidade");
	btnEnvia = $.minhaTopBar.addRightButtom("/images/aprova.png", checkSave);
	$.observacao.init({nome: "Observacao"});
};

$.winPatologia.addEventListener("open", function(e){
	Alloy.Globals.carregando();
	if(args.edit){
		btnEnvia.enabled = false;
		btnEnvia.visible = false;
		$.observacao.setInputValue(args.patologia.Observacao);
		$.observacao.setEnable(false);
		$.btnNovaFoto.enable = false;
		$.btnNovaFoto.visible = false;
		$.currentImage.removeEventListener("click", pegaPatologia);
		var imagensCol = Alloy.createCollection("InfoImagemPatologia");
		imagensCol.fetch({query: "select * from InfoImagemPatologia where Patologia_id = " + args.patologia.Id });
		for(var i = 0; i < imagensCol.length; i++){
			var imgPatologiaRow  = imagensCol.at(i).toJSON();
			addImage({
				edit: false,
				imagem: Ti.Utils.base64decode(imgPatologiaRow.Imagem), 
				latitude: imgPatologiaRow.Latitude, 
				longitude: imgPatologiaRow.Longitude, 
				data: imgPatologiaRow.Data
			});
		}
	}
	Alloy.Globals.carregou();
});

function checkSave(e){
	var check = Alloy.createWidget("GUI", "Mensagem");
	if($.imagens.children.length <= 1){
		check.init("Alerta", "É obrigatório pelo menos uma foto.");
		check.show({callback: function(){}});
		return;
	}
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
	if($.imagens.children.length == 6){
		Alloy.Globals.Alerta("Atenção", "O quantidade máxima de imagens por patologia é 5.");
		return ;
	}
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
	
	var dataAtual = new Date();
	
	if(evt.media.getWidth() > evt.media.getHeight()){
		relacaoAltura = 0.7;
	}else if(evt.media.getWidth() < evt.media.getHeight()){
		relacaoLargura = 0.7;
	}
	
	var altura = 350 * relacaoAltura;
	var largura = 350 * relacaoLargura;
	
	var imagem = null;
	
	var viewImage = Ti.UI.createView({
		width: largura,
		height: altura,
		backgroundColor: "transparent"
	});
	
	var imgViewAux = Ti.UI.createImageView({
		image: evt.media.imageAsThumbnail(1000),
		width: Ti.UI.FILL,
		height: Ti.UI.FILL
	});
	
	viewImage.add(imgViewAux);
	
	imgViewAux.addEventListener('load', function(e){
		imagem = viewImage.toImage();
		$.currentImage.setImage(imagem);
		addImage({edit: true, imagem: imagem, latitude: coords.latitude, 
			longitude: coords.longitude, data: dataAtual});
		Alloy.Globals.carregou();
	});
	
	var viewInfoAux = Ti.UI.createView({
		layout: 'vertical',
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		right: 10,
		bottom: 10,
		backgroundColor: 'transparent'
	});
	viewImage.add(viewInfoAux);
	
	var dataLabel = Ti.UI.createLabel({
		font: {fontSize: 7},
		width: Ti.UI.FILL,
		color: "white",
		text: "Data: " + Alloy.Globals.format.customFormatData(dataAtual, undefined, "DD/MM/YYYY"),
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
	});
	viewInfoAux.add(dataLabel);
	
	var horaLabel = Ti.UI.createLabel({
		font: {fontSize: 7},
		width: Ti.UI.FILL,
		color: "white",
		text: "Hora: " + Alloy.Globals.format.customFormatData(dataAtual, undefined, "HH:mm:ss"),
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
	});
	viewInfoAux.add(horaLabel);
	
	var latitudeLabel = Ti.UI.createLabel({
		font: {fontSize: 7},
		width: Ti.UI.FILL,
		color: "white",
		text: "Latitude: " + coords.latitude,
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
	});
	viewInfoAux.add(latitudeLabel);
	
	var longitudeLabel = Ti.UI.createLabel({
		font: {fontSize: 7},
		width: Ti.UI.FILL,
		color: "white",
		text: "Longitude: " + coords.longitude,
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
	});
	viewInfoAux.add(longitudeLabel);
	
	imagem = viewImage.toImage();
	
}

function addImage(parans){
	var imgView = Ti.UI.createImageView({
		width: 40,
		height: 40,
		right: 5,
		indice: $.imagens.children.length,
		image: parans.imagem
	});
	
	lstImagens.push({
		Data: Alloy.Globals.format.customFormatData(parans.data, undefined, "YYYY-MM-DD HH:mm:ss"),
		Latitude: parans.latitude,
		Longitude: parans.longitude,
		Imagem: Ti.Utils.base64encode(parans.imagem).text
	});
	
	imgView.addEventListener("click", function(e){
		if(e.source.indice != imagemAtual){
			imagemAtual = e.source.indice;
			susbtituiImagemPrincipal(e.source.image);
		}
	});
	
	if(parans.edit == true){
		imgView.addEventListener("longclick", checkRemoveImagem);	
	}
	
	imagemAtual = imgView.indice;
	
	if($.imagens.children.length == 1){
		$.currentImage.removeEventListener("click", pegaPatologia);
	}
	
	susbtituiImagemPrincipal(parans.imagem);
	$.imagens.add(imgView);
	adaptaPlusBtn();
}

function susbtituiImagemPrincipal(imagem){
	$.currentImage.setImage(imagem);
}

function adaptaPlusBtn(){
	$.imagens.remove($.btnNovaFoto);
	$.imagens.add($.btnNovaFoto);
}

function checkRemoveImagem(e){
	var removeImagem = function (clk){
		if(!clk.value){
			return ;
		}
		Alloy.Globals.carregando();
		for(var i = e.source.indice; i <= $.imagens.children.length; i++){
			$.imagens.children[i - 1].indice = $.imagens.children[i - 1].indice - 1;
			lstImagens.splice($.imagens.children[i - 1].indice - 1, 1);
		}
		$.imagens.remove(e.source);
		
		if($.imagens.children.length <= 1){
			$.currentImage.addEventListener("click", pegaPatologia);
			$.currentImage.setImage("/images/camera.png");
		}else if($.imagens.children[e.source.indice] != undefined && $.imagens.children[e.source.indice].image != undefined){
			$.currentImage.setImage($.imagens.children[e.source.indice].image);
		}else{
			Ti.API.info(JSON.stringify($.imagens.children));
			$.currentImage.setImage($.imagens.children[e.source.indice - 1].image);
		}
		
		Alloy.Globals.carregou();
	};
	var check = Alloy.createWidget("GUI", "Mensagem");
	check.init("Alerta", "Gostaria de remover a imagem ?", true);
	check.show({callback: removeImagem});
}

function enviarPatologia(e){
	if(!e.value){
		return ;
	}
	var patologias = lstImagens;
	
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucessEnviarPatologia,
		error: failEnviarPatologia,
		url:  Alloy.Globals.MainDomain + "api/patologias/criaPatologia", 
		metodo: "POST", 
		timeout: 120000
	});
	if(ws){
		Ti.API.info(JSON.stringify({
			Obra_id: Alloy.Globals.Obra.id,
			usuarioId: Alloy.Globals.Cliente.at(0).get("id"),
			Observacao: $.observacao.getInputValue(),
			patologias: patologias
		}));
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
		check.init("Sucesso", "Patologia enviada com sucesso !");
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


