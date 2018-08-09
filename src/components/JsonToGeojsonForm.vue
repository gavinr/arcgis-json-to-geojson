<template>
  <form>
    <div class="form-group">
      <textarea rows="10" class="form-control" v-bind:placeholder="placeholder" v-model="inputJson"></textarea>
    </div>
    <div class="form-group float-right">
      <button type="button" class="btn btn-primary" v-on:click.prevent="convert()">Convert</button>
    </div>

    <div class="form-group">
      <textarea rows="10" class="form-control" v-show="showResultArea" v-model="resultJsonString"></textarea>
    </div>

    <div class="form-row align-items-center">
      <div class="col">
        <label v-show="showResultArea">Pretty Print <input type="checkbox" v-model="prettyPrint" /></label> 
      </div>
    </div>

  </form>
</template>

<script>
import ArcgisToGeojsonUtils from '@esri/arcgis-to-geojson-utils';

export default {
  name: 'JsonToGeojsonForm',
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
    convert: function() {
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
        this.$emit('geojson', featureCollection);
      } catch (e) {
        this.resultJson = 'Invalid input.';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  textarea {
    font-family: 'Roboto Mono', monospace;
  }
</style>
