/**
 * @class controllers.Index
 * Classe principal, primeira a ser executada.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

var semaforoLogin = false;

/**
 * @property {widgets.Login.SolicitacoesLogin} solicitacoes Classe responsável por buscar o dominio da empresa vinculada ao token e validar o login e senha neste domínio.
 * @private 
 */
var solicitacoes = Alloy.createController("SolicitacoesLogin");

/**
 * @method callbackOK
 * Rotina executada caso o login seja bem-sucedido.
 * Chama a classe Boletos e inicia a lista de serviços com os serviços globais.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var callbackOK = function(){
	try{
		Alloy.Globals.iniciarServicos();
		Alloy.Globals.carregou();
		var novo = Alloy.createController("Principal");
		Alloy.Globals.Transicao.nova(novo, novo.init, {});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "callbackOK", "app/controllers/index.js");
	}
};

/**
 * @method callbackNaoOK
 * Rotina executada caso ocorra erro ao tentar fazer o login.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var callbackNaoOK = function(mensagem){
	try{
		Alloy.Globals.Alerta("Erro ao entrar", mensagem);
		Alloy.Globals.carregou();
	}
	catch(e){
		Alloy.Globals.onError(e.message, "callbackNaoOK", "app/controllers/index.js");
	}
};

/**
 * @method init
 * Construtor da classe
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function init(){
	try{
		Alloy.Globals.configWindow($.janela, $);
		$.login.init({nome: "Login", next: $.senha});
		$.senha.init({nome: "Senha"});
		$.senha.novoNome.passwordMask = true;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/index.js");
	}
}

if(Alloy.Globals.Cliente.length > 0){
	Alloy.Globals.Cloud.sessionId = Alloy.Globals.Cliente.at(0).get("sessionId");
	if(Alloy.Globals.estaOnline){
		Alloy.Globals.Cloud.Users.showMe(function(e){
			if (e.success) {
		        var user = e.users[0];
		        Alloy.Globals.InfoUser = user;
		        callbackOK();    
		    } else {
				Alloy.Globals.Transicao.nova($, init, {});        
		    }
		});	
	}else{
		callbackOK();
	}
	
}
else{
	//Abro a janela.
	Alloy.Globals.Transicao.nova($, init, {});
}


function checkLogin(){
	try{
		var check = Alloy.createWidget("GUI", "Mensagem");
		if($.login.getInputValue() == ""){
			check.init("Alerta", "Informe o login.");
			check.show({callback: $.login.selecionar});
			return;
		}
		if($.senha.getInputValue() == ""){
			check.init("Alerta", "Preencha a senha.");
			check.show({callback: $.senha.selecionar});
			return;
		}
		Alloy.Globals.carregando();
		solicitacoes.executeLogin(callbackOK, callbackNaoOK, 
			{login: $.login.getInputValue(), senha: $.senha.getInputValue()});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "checkLogin", "app/widgets/Login/controllers/login.js");
	}
}

