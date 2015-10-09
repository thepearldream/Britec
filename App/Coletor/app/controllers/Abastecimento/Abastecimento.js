var args = arguments[0] || {};

var infoVeiculosObra= Alloy.createCollection("InfoVeiculoObra");

infoVeiculosObra.fetch();

var chaves = ["Id"];

$.init = function(parans){
	Alloy.Globals.configWindow($.winAbastecimento, $);
	$.minhaTopBar.iniciar("Abastecimento");
	$.minhaTopBar.addRightButtom("/images/aprova.png", checkSave);
	/*texto*/
	$.horimetro.init({nome: "Horímetro", keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD, next: $.quantidade});
	$.quantidade.init({nome: "Quantidade", keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD, next: $.observacao});
	$.observacao.init({nome: "Observacao"});
	
	/*dates*/
	$.data.init({nome: "Data do abastecimento"});
	
	/*combobox*/
	$.veiculos.init({nome: "Veículos da obra", colecao: infoVeiculosObra, chave: chaves, coluna: "PlacaDescricao"});
	
	/*RadioGroup*/
	$.grpCombustivel.setGroup(["Diesel", "Remocil"]);
};

$.winAbastecimento.addEventListener("open", function(e){
	obtemVeiculosObra();
});

function obtemVeiculosObra(e){
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucessObtemVeiculosObra,
		error: failSincronizacao,
		url:  Alloy.Globals.MainDomain + "api/obras/getVeiculosObra", 
		metodo: "POST", 
		timeout: 120000,
		colecao: infoVeiculosObra
	});
	if(ws){
		ws.adicionaParametro({Obra_id: Alloy.Globals.Obra.id});
		ws.NovoEnvia();
	}
}

function sucessObtemVeiculosObra(ret){
	infoVeiculosObra.trigger("change");
}

function failSincronizacao(ret){
	Alloy.Globals.Alerta("Erro", "Erro ao sincronizar os dados dos veiculos da obra. descricao: " + ret.error);
}

function alteraAbastecimento(e){
	$.quantidade.setDesc(e.index==0?"Diesel":"Remocil");
	$.quantidade.setInputValue("");
}

function checkSave(e){
	var check = Alloy.createWidget("GUI", "Mensagem");
	if($.data.getSelected().data == ""){
		check.init("Alerta", "Preencha a data do abastecimento.");
		check.show({callback: $.data.selecionar});
		return;
	}
	if($.veiculos.getSelected().chave == ""){
		check.init("Alerta", "É necessário selecionar o veículo abastecido.");
		check.show({callback: $.veiculos.selecionar});
		return;		
	}
	if($.horimetro.getInputValue() == ""){
		check.init("Alerta", "Preencha o valor do horímetro do veículo.");
		check.show({callback: $.horimetro.selecionar});
		return;
	}
	if($.quantidade.getInputValue() == ""){
		check.init("Alerta", "Preencha a quantidade de litros do abastecimento.");
		check.show({callback: $.quantidade.selecionar});
		return;
	}
	
	var check = Alloy.createWidget("GUI", "Mensagem");
	check.init("Alerta", "Confirma o envio desse abastecimento ?", true);
	check.show({callback: enviarAbastecimento});
}

function enviarAbastecimento(){
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucessEnviarAbastecimento,
		error: failEnviarAbastecimento,
		url:  Alloy.Globals.MainDomain + "api/abastecimentoes/insereAbastecimento", 
		metodo: "POST", 
		timeout: 120000
	});
	if(ws){
		ws.adicionaParametro({
			Obra_id: Alloy.Globals.Obra.id,
			Veiculo_id: $.veiculos.getSelected().chave[0],
			Usuario_id: Alloy.Globals.Cliente.at(0).get("id"),
			Observacao: $.observacao.getInputValue(),
			DataAbastecimento: 	Alloy.Globals.format.customFormatData($.data.getSelected().data, "DD/MM/YYYY", "YYYY-MM-DD 00:00:00"),
			Horimetro: $.horimetro.getInputValue(),
			Quantidade: $.quantidade.getInputValue(),
			CategoriaAbastecimento_id: parseInt($.grpCombustivel.getSelected().index)+1
		});
		ws.NovoEnvia();
	}
}

function sucessEnviarAbastecimento(ret){
	var check = Alloy.createWidget("GUI", "Mensagem");
	check.init("Sucesso", "Abastecimento enviado com sucesso !");
	check.show({callback: voltar});
}

function failEnviarAbastecimento(ret){
	Alloy.Globals.Alerta("Erro", "Erro ao enviar o abastecimento. descricao: " + ret.error);
}

function voltar(){
	Alloy.Globals.Transicao.anterior();
	args.pai.callRefresh();
}
