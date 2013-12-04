$(document).ready(function() {
	var app = new App("Gavin", "Rehkemper");
});

var App = makeClass();
App.prototype.init = function() {
	$("#jsonTextArea").click(function(evt) {
		if ($("#jsonTextArea").val() === "Put ArcGIS JSON here.") {
			$("#jsonTextArea").val("");
		}
	});

	$("#convertButton").click($.proxy(function(evt) {
		//$("#jsonTextArea").val()
		$.ajax({
			type: "POST",
			url: "./agsJSON",
			data: {
				"data": $("#jsonTextArea").val()
			},
			success: function(success) {
				if (success && success.hasOwnProperty('success') && success.success === true) {
					$("#resultTextArea").show();
					$("#resultTextArea").val(JSON.stringify(success.data));

					$.ajax({
						url: 'https://api.github.com/gists',
						headers: {
							"User-Agent": "arcgis-json-to-geojson",
							"Origin": "http://togeojson.com"
						},
						type: "POST",
						cache: false,
						processData: false,
						data: JSON.stringify({
							"description": "GEOJSON created by http://arcgisjson.togeojson.com",
							"public": true,
							"files": {
								"arcgis-json-to-geojson.geojson": {
									"content": JSON.stringify(success.data)
								}
							}
						})
					}).done(function(msg) {
						$("#gistLink").attr("href", msg.html_url);
						$("#gistLinkContainer").show();
					});
				}
			},
			dataType: "json"
		});
	}, this));

};