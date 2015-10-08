exports.definition = {
	config: {
		columns: {
			"Motorista":"string",
			"Toneladas":"double",
			"Viagens":"int",
			"MediaToneladasViagem":"double",
			"ValorBruto":"double"
		},
		adapter: {
			type: "properties",
			collection_name: "Frete",
			idAttribute: "Motorista"
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