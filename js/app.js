const JsonToGeojsonForm = {
	template: `
	<div>
		<textarea rows="10" cols="100" v-bind:placeholder="placeholder" v-model="inputJson"></textarea><br />
		<input type="button" value="Convert" v-on:click.prevent="convert()" /><br /><br />
		<textarea rows="10" cols="100" v-show="showResultArea">{{ resultJsonString }}</textarea><br />
		<label v-show="showResultArea">Pretty Print <input type="checkbox" v-model="prettyPrint" /></label>
	</div>`,
	props: ['placeholder'],
	data: () => {
		return {
			inputJson: '',
			resultJson: '',
			prettyPrint: true
		};
	},
	computed: {
		showResultArea: function() {
			return this.resultJson !== '';
		},
		resultJsonString: function() {
			return JSON.stringify(this.resultJson, null, (this.prettyPrint ? 2 : undefined));
		}
	},
	methods: {
		convert: function(evt) {
			try {
				const inputJson = JSON.parse(this.inputJson);
				// if this is an object, assume FeatureSet. If array, assume array of features.
				let features = inputJson;
				if(!Array.isArray(inputJson)) {
					features = inputJson.features;
				}
				const geoJsonFeatures = features.map((feature, i) => {
					let f = ArcgisToGeojsonUtils.arcgisToGeoJSON(feature);
					f.id = i;
					return f;
				});

				let featureCollection = {
					type: 'FeatureCollection',
					features: geoJsonFeatures
				}

				this.resultJson = featureCollection;

			} catch (e) {
				this.resultJson = 'Invalid input.';
			}
		}
	}
};

var app = new Vue({
  el: '#app',
  components: {
		'json-to-geojson-form': JsonToGeojsonForm
	}
})