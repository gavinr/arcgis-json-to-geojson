const JsonToGeojsonForm = {
	template: `
	<div>
		<textarea rows="10" cols="100" v-bind:placeholder="placeholder" v-model="inputJson"></textarea><br />
		<input type="button" value="Convert" v-on:click.prevent="convert()" /><br /><br />
		<textarea rows="10" cols="100" v-model="resultJson" v-show="showResultArea">Result appears here.</textarea>
	</div>`,
	props: ['placeholder'],
	data: () => {
		return {
			inputJson: '',
			resultJson: ''
		};
	},
	computed: {
		showResultArea: function() {
			return this.resultJson !== '';
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

				this.resultJson = JSON.stringify(featureCollection);

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