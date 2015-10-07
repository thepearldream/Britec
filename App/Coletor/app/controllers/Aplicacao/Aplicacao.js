var args = arguments[0] || {};

var fasesObra = Alloy.createCollection("InfoFaseDaObra");

fasesObra.fetch();

var infoMotoristas = Alloy.createCollection("InfoMotorista");

infoMotoristas.fetch();

var infoVeiculos= Alloy.createCollection("InfoVeiculo");

infoVeiculos.fetch();

var chaves = ["Id"];

$.init = function(parans){
	Alloy.Globals.configWindow($.winAplicacao, $);
	$.minhaTopBar.iniciar("Aplicação");
	$.minhaTopBar.addRightButtom("/images/aprova.png", checkSave);
	/*texto*/
	$.nota.init({nome: "Nota", next: $.estaca});
	$.estaca.init({nome: "Estaca", next: $.largura});
	$.largura.init({nome: "Largura", keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD, next: $.comprimento});
	$.comprimento.init({nome: "Comprimento", keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD, next: $.toneladas});
	$.toneladas.init({nome: "Toneladas", keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD, next: $.temperatura});
	$.temperatura.init({nome: "Temperatura", keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD});
	
	/*dates*/
	$.periodoInicial.init({nome: "Hora inicial da aplicação", tipo: Ti.UI.PICKER_TYPE_TIME});
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

function checkSave(e){
	
}
