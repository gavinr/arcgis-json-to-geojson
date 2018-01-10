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
      <div class="col">
        <button type="button" class="btn btn-info float-right" v-show="showResultArea && gistLink === ''" v-on:click.prevent="postToGist()">Visualize via Gist</button>
      </div>
      <div class="col" v-show="gistLink">
        <a class="btn btn-success float-right" v-bind:href="gistLink" target="_blank">See map!</a>
      </div>
    </div>

  </form>
</template>

<script>
import ArcgisToGeojsonUtils from '@esri/arcgis-to-geojson-utils';
import swal from 'sweetalert/dist/sweetalert.min';
import axios from 'axios/dist/axios.min';

export default {
  name: 'JsonToGeojsonForm',
  props: ['placeholder'],
  data: () => {
    return {
      inputJson: '',
      resultJson: '',
      prettyPrint: true,
      gistLink: ''
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
        this.$emit('geojson', featureCollection);
        this.gistLink = '';
      } catch (e) {
        this.resultJson = 'Invalid input.';
        this.gistLink = '';
      }
    },

    postToGist: function(evt) {
      swal({
        title: "Are you sure?",
        content: {
          element: "span",
          attributes: {
            innerHTML: 'This will post your GeoJSON to a public <a href="https://help.github.com/articles/about-gists/" target="_blank">GitHub Gist</a> so you can visualize it on a map. Are you sure you want to do this?'
          },
        },
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then(function(doPost) {
        if(doPost) {
          axios.post('https://api.github.com/gists', JSON.stringify({
            description: 'GEOJSON created by http://arcgisjson.togeojson.com',
            public: 'true',
            files: {
              'arcgis-json-to-geojson.geojson': {
                'content': JSON.stringify(this.resultJson)
              }
            }
          }), {
            headers: {
              "User-Agent": "arcgis-json-to-geojson",
              "Origin": "http://togeojson.com"
            }
          })
          .then(function (response) {
            this.gistLink = response.data.html_url;
          }.bind(this))
          .catch(function (error) {
            console.log(error);
          });
        }
      }.bind(this));
      
    }
  }
}
</script>

<style lang="scss">

</style>
