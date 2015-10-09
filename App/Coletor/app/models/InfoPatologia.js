exports.definition = {
	config: {
		columns: {
		    "Id": "int PRIMARY_KEY",
		    "Patologia_id": "int",
		    "Imagem": "string",
		    "Data": "datetime",
		    "Latitude": "string",
		    "Longitude": "string",
		    "Obra_id": "int",
		    "DescObra": "string"
		},
		adapter: {
			type: "sql",
			collection_name: "InfoPatologia",
			idAttribute: "Id"
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