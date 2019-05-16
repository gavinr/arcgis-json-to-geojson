<template>
  <form>
    <div class="form-group">
      <textarea rows="10" class="form-control" v-bind:placeholder="placeholder" v-model="inputJson"></textarea>
    </div>

    <div class="form-group float-right">
      <button type="button" class="btn btn-primary" v-on:click.prevent="convert()">Convert</button>
    </div>

    <div class="form-row align-items-center" v-if="showWgs84Alert">
      <div class="col">
        <div class="alert alert-warning" role="alert">
          It looks like your FeatureSet has features with geometries with spatial references not in Latitude/Longitude (WGS84). In general, GeoJSON only works with WGS84, which is why the map probably looks wrong, so you probably want to change your input data to have that spatial reference. Try setting the "Output Sptaial Reference" to 4326.
        </div>
      </div>
    </div>

    <div class="form-group">
      <textarea rows="10" class="form-control" v-show="showResultArea" v-model="resultJsonString"></textarea>
    </div>

    <div class="form-row" v-show="showResultArea">
      <div class="col d-flex align-items-center justify-content-between">
        <label class="m-0" v-show="showResultArea">Pretty Print <input type="checkbox" v-model="prettyPrint" /></label>
        <button type="button" class="btn btn-primary"
          v-clipboard:copy="resultJsonString"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError">{{ copyText }}</button>
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
      prettyPrint: true,
      showWgs84Alert: false,
      originalCopyText: 'Copy',
      copyText: 'Copy',
    };
  },
  computed: {
    showResultArea: function() {
      return this.resultJson !== '';
    },
    resultJsonString: function() {
      return JSON.stringify(this.resultJson, null, (this.prettyPrint ? 2 : undefined));
    },
  },
  methods: {
    convert: function() {
      let inputJson = false;
      try {
        inputJson = JSON.parse(this.inputJson);
      } catch (e) {
        this.resultJson = 'Invalid JSON. Please check using jsonlint.com.';
      }

      if(inputJson) {
        try {
          this.showWgs84Alert = false;
          if(inputJson.hasOwnProperty('spatialReference') && inputJson.spatialReference.hasOwnProperty('wkid') && inputJson.spatialReference.wkid !==4326) {
            this.showWgs84Alert = true;
          }
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
    },
    onCopy() {
      this.copyText = 'Copied';
      setTimeout(() => {
        this.copyText = this.originalCopyText;
      }, 2000)
    },
    onError() {
      this.copyText = 'Can not copy';
    },
  }
}
</script>

<style lang="scss" scoped>
  textarea {
    font-family: 'Roboto Mono', monospace;
  }
</style>
