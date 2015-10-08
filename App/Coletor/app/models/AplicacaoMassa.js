exports.definition = {
	config: {
		columns: {
		    "usuarioId": "string",
		    "id": "int PRIMARY_KEY",
		    "Nota": "string",
		    "Fase_id": "int",
		    "Estaca": "int",
		    "data": "datetime",
		    "HoraInicio": "datetime",
		    "HoraFim": "datetime",
		    "Motorista_id": "int",
		    "Veiculo_id": "int",
		    "Largura": "double",
		    "Comprimento": "double",
		    "Toneladas": "double",
		    "Temperatura": "double",
		    "Espessura": "double"
		},
		adapter: {
			type: "sql",
			collection_name: "AplicacaoMassa",
			idAttribute: "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here

			// For Backbone v1.1.2, uncomment the following to override the
			// fetch method to account for a breaking change in Backbone.
			/*
			fetch: function(options) {
				options = options ? _.clone(options) : {};
				options.reset = true;
				return Backbone.Collection.prototype.fetch.call(this, options);
			}
			*/
		});

		return Collection;
	}
};