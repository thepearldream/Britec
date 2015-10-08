var args = arguments[0] || {};

$.init = function(parans){
	if(parans.nome){
		$.lblDesc.text = parans.nome;
	}
	if(parans.keyboardType){
		$.desc.setKeyboardType(parans.keyboardType);
	}
	if(parans.next){
		$.desc.setReturnKeyType(Ti.UI.RETURNKEY_NEXT);
		$.desc.addEventListener("return", function(e){
			parans.next.selecionar();
		});
		
		if(parans.keyboardType == Titanium.UI.KEYBOARD_NUMBER_PAD && Ti.Platform.name === 'iPhone OS'){
			var flexSpace = Titanium.UI.createButton({
			    systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
			});
			var proximo = Titanium.UI.createButton({
			    title: 'Seguinte',
			    style: Titanium.UI.iPhone.SystemButtonStyle.DONE,
			});
			proximo.addEventListener("click", function(e){
				parans.next.selecionar();
			});
			var toolbar = Titanium.UI.iOS.createToolbar({
			    items:[flexSpace, proximo]
			});
			$.desc.keyboardToolbar = toolbar;
		}
		
	}else{
		$.desc.setReturnKeyType(Ti.UI.RETURNKEY_DONE);
		$.desc.addEventListener("return", function(e){
			$.desc.blur();
		});
	}
	return null;
};

$.getInputValue = function(){
	return $.desc.value;
};

$.setDesc = function(desc){
	$.lblDesc.text = desc;
};

$.setInputValue = function(value){
	$.desc.value = value;
};
$.desfocar = function(){
	$.desc.blur();
};

$.selecionar = function(){
	$.desc.focus();
};