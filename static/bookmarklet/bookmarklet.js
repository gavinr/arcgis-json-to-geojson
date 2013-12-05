(function() {

	// the minimum version of jQuery we want
	var v = "1.3.2";

	// check prior inclusion and version
	if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
		var done = false;
		var script = document.createElement("script");
		script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
		script.onload = script.onreadystatechange = function() {
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
				done = true;
				initMyBookmarklet();
			}
		};
		document.getElementsByTagName("head")[0].appendChild(script);
	} else {
		initMyBookmarklet();
	}


	function initMyBookmarklet() {
		(window.myBookmarklet = function() {
			// your JavaScript code goes here!
			var elements = document.getElementsByTagName('pre');

			if (elements.length == 1) {
				var jsonString = elements[0].innerHTML;
				$.ajax({
					type: "POST",
					url: endpointUrl(),
					data: {
						"data": jsonString
					},
					success: function(success) {
						// alert(success);
						document.write(JSON.stringify(success.data));
					},
					error: function(err) {
						alert("ERROR " + err);
					},
					dataType: "json"
				});

			} else {
				console.log("Problem with contents of page! Please use a page that only has ArcGIS JSON");
			}

		})();
	}

	function endpointUrl() {
		// get the url of the main site that we're getting this from.
		var scriptSource = (function(scripts) {
			var scripts = document.getElementsByTagName('script'),
				script = scripts[scripts.length - 1];

			if (script.getAttribute.length !== undefined) {
				return script.src
			}
			return script.getAttribute('src', -1)
		}());

		// Take the current site and craft the url to what we want.
		var n = scriptSource.indexOf("/bookmarklet/bookmarklet.js");
		if (n > -1) {
			return scriptSource.substring(0, n) + "/agsJSON";
		} else {
			return "http://localhost:8080/agsJSON";
		}
	}

})();