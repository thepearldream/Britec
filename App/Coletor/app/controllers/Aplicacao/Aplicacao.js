var args = arguments[0] || {};

var fasesObra = Alloy.createCollection("InfoFaseDaObra");

fasesObra.fetch();

var infoMotoristas = Alloy.createCollection("InfoMotorista");

infoMotoristas.fetch();

var infoVeiculos= Alloy.createCollection("InfoVeiculo");

infoVeiculos.fetch();

var chaves = ["Id"];

var espessura = null;

$.init = function(parans){
	Alloy.Globals.configWindow($.winAplicacao, $);
	$.minhaTopBar.iniciar("Aplicação");
	$.minhaTopBar.addRightButtom("/images/aprova.png", checkSave);
	/*texto*/
	$.nota.init({nome: "Número da nota fiscal", next: $.estaca});
	$.estaca.init({nome: "Estaca", keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD, next: $.largura});
	$.largura.init({nome: "Calculo de espessura: Largura", keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD, next: $.comprimento});
	$.comprimento.init({nome: "Calculo de espessura: Comprimento", keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD, next: $.toneladas});
	$.toneladas.init({nome: "Calculo de espessura: Toneladas", keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD, next: $.temperatura});
	$.temperatura.init({nome: "Temperatura", keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD});
	
	/*dates*/
	$.periodoInicial.init({nome: "Hora inicial da aplicação", tipo: Ti.UI.PICKER_TYPE_TIME});
	$.periodoInicial.setSelected({valor: new Date()});
	$.periodoFinal.init({nome: "Hora final da aplicação", tipo: Ti.UI.PICKER_TYPE_TIME});
	
	/*combobox*/
	$.fasesObra.init({nome: "Fases da obra", colecao: fasesObra, chave: chaves, coluna: "Descricao"});
	$.motoristas.init({nome: "Motoristas", colecao: infoMotoristas, chave: chaves, coluna: "Nome"});
	$.veiculos.init({nome: "Veículos", colecao: infoVeiculos, chave: chaves, coluna: "PlacaDescricao"});
};

$.winAplicacao.addEventListener("open", function(e){
	obtemFasesObra();
	obtemMotoristas();
	obtemVeiculos();
});

function preencheFormulario(){
	if(args.edit == true){
		var aplicacao = args.aplicacao.toJSON();
	}
}

function obtemFasesObra(e){
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucessFasesObra,
		error: failSincronizacao,
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

function sucessFasesObra(ret){
	fasesObra.trigger("change");
}

function obtemMotoristas(e){
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucessObtemMotoristas,
		error: failSincronizacao,
		url:  Alloy.Globals.MainDomain + "api/motoristas/getMotoristas", 
		metodo: "POST", 
		timeout: 120000,
		colecao: infoMotoristas
	});
	if(ws){
		ws.adicionaParametro({});
		ws.NovoEnvia();
	}
}

function sucessObtemMotoristas(ret){
	infoMotoristas.trigger("change");
}

function obtemVeiculos(e){
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucessObtemVeiculos,
		error: failSincronizacao,
		url:  Alloy.Globals.MainDomain + "api/veiculoes/getVeiculos", 
		metodo: "POST", 
		timeout: 120000,
		colecao: infoVeiculos
	});
	if(ws){
		ws.adicionaParametro({});
		ws.NovoEnvia();
	}
}

function sucessObtemVeiculos(ret){
	infoVeiculos.trigger("change");
}

function failSincronizacao(ret){
	Alloy.Globals.Alerta("Erro", "Erro ao sincronizar os dados. descricao: " + ret.error);
}

function calculaEspessura(e){
	if($.largura.getInputValue() != "" && $.comprimento.getInputValue() != "" && $.toneladas.getInputValue() != ""){
		var area = parseFloat($.comprimento.getInputValue()) * parseFloat($.largura.getInputValue());
		espessura = ((parseFloat($.toneladas.getInputValue())/area)/2.4*100).toFixed(2);
		$.lblEspessura.text = "Espessura: " + espessura.toString() + "cm";
	}else{
		espessura = null;
		$.lblEspessura.text = "Espessura: - ";
	}
}

function checkSave(e){
	var check = Alloy.createWidget("GUI", "Mensagem");
	if($.nota.getInputValue() == ""){
		check.init("Alerta", "Preencha o número da nota.");
		check.show({callback: $.nota.selecionar});
		return;
	}
	if($.fasesObra.getSelected().chave == ""){
		check.init("Alerta", "É necessário selecionar a fase da obra.");
		check.show({callback: $.fasesObra.selecionar});
		return;		
	}
	if($.estaca.getInputValue() == ""){
		check.init("Alerta", "Preencha a estaca.");
		check.show({callback: $.estaca.selecionar});
		return;
	}
	if($.periodoInicial.getSelected().data == ""){
		check.init("Alerta", "Preencha a hora do início da aplicação.");
		check.show({callback: $.periodoInicial.selecionar});
		return;
	}
	if($.periodoFinal.getSelected().data == ""){
		check.init("Alerta", "Preencha a hora de termino da aplicação.");
		check.show({callback: $.periodoFinal.selecionar});
		return;
	}
	if($.motoristas.getSelected().chave == ""){
		check.init("Alerta", "É necessário selecionar o motorista.");
		check.show({callback: $.motoristas.selecionar});
		return;		
	}
	if($.veiculos.getSelected().chave == ""){
		check.init("Alerta", "É necessário selecionar o veículo.");
		check.show({callback: $.veiculos.selecionar});
		return;
	}
	if($.largura.getInputValue() == ""){
		check.init("Alerta", "Preencha a largura.");
		check.show({callback: $.largura.selecionar});
		return;
	}
	if($.comprimento.getInputValue() == ""){
		check.init("Alerta", "Preencha o comprimento.");
		check.show({callback: $.comprimento.selecionar});
		return;
	}
	if($.toneladas.getInputValue() == ""){
		check.init("Alerta", "Preencha a quantidade de toneladas de massa na aplicação.");
		check.show({callback: $.toneladas.selecionar});
		return;
	}
	if($.temperatura.getInputValue() == ""){
		check.init("Alerta", "Preencha a temperatura da massa.");
		check.show({callback: $.temperatura.selecionar});
		return;
	}
	var check = Alloy.createWidget("GUI", "Mensagem");
	check.init("Alerta", "Confirma o envio dessa anplicação ?", true);
	check.show({callback: enviarAplicacao});
}

function enviarAplicacao(){
	var hoje = Alloy.Globals.format.customFormatData(new Date(), undefined, "YYYY-MM-DD");
	var mdAplicacao = Alloy.createModel("AplicacaoMassa", {
		usuarioId: Alloy.Globals.Cliente.at(0).get("id"),
		Nota: $.nota.getInputValue(), 
		Fase_id: $.fasesObra.getSelected().chave[0], 
		Estaca: $.estaca.getInputValue(), 
		data: hoje + " 00:00:00", 
		HoraInicio: hoje + " " + $.periodoInicial.getSelected().data, 
		HoraFim: hoje + " " + $.periodoFinal.getSelected().data, 
		Motorista_id: $.motoristas.getSelected().chave[0], 
		Veiculo_id: $.veiculos.getSelected().chave[0], 
		Largura: $.largura.getInputValue(), 
		Comprimento: $.comprimento.getInputValue(), 
		Toneladas: $.toneladas.getInputValue(), 
		Temperatura: $.temperatura.getInputValue(), 
		Espessura: espessura
	});
	
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucessEnviarAplicacao,
		error: failEnviarAplicacao,
		url:  Alloy.Globals.MainDomain + "api/controleaplicacaomassas/inserirAplicacao", 
		metodo: "POST", 
		timeout: 120000,
		offSync: {
			model: mdAplicacao,
			modelName: "AplicacaoMassa",
			tipo: Alloy.Globals.tipoSincronizacao.ENVIANDO
		}
	});
	if(ws){
		ws.adicionaParametro(mdAplicacao.toJSON());
		ws.NovoEnvia();
	}
}

function sucessEnviarAplicacao(ret){
	var check = Alloy.createWidget("GUI", "Mensagem");
	check.init("Sucesso", "Cadastro enviado com sucesso !");
	check.show({callback: voltar});
}

function failEnviarAplicacao(ret){
	Alloy.Globals.Alerta("Erro", "Erro ao enviar a aplicação. descricao: " + ret.error);
}

function voltar(){
	Alloy.Globals.Transicao.anterior();
	args.pai.callRefresh();
}
