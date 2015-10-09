var args = arguments[0] || {};

$.tiraFoto = function(parans){
	Titanium.Media.showCamera({
		success: parans.callback,
		cancel:function() { Ti.API.info("cancelou"); },
		error: parans.erro,
		saveToPhotoGallery:false,
		allowEditing:true,
		mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
	});
};

