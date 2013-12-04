var terraformer = require('terraformer-arcgis-parser');

exports.toGeoJSON = function(req, res) {
	if (req.params && req.params.data) {
		if (JSON.parse(req.params.data)) {
			// valid json
			var arcgisFeatures = JSON.parse(req.params.data);
			var FeatureCollection = {
				type: "FeatureCollection",
				features: []
			}

			// https://github.com/Esri/Terraformer/issues/104
			for (var i = 0; i < arcgisFeatures.features.length; i++) {
				var feature = arcgisFeatures.features[i];
				
				var feature = terraformer.parse(feature);
				feature.id = i;
				FeatureCollection.features.push(feature);
			};
			res.send({
				"success": true,
				"data": FeatureCollection
			});
		} else {
			res.send({
				"success": false,
				"data": "issue parsing"
			});
		}
	}
}