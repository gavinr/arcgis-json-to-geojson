<template>
  <div id="app">
    <header>
      <h1>{{ title }}</h1>
    </header>
    
  
    <div class="instructions">
      <p>Copy in some ArcGIS JSON. (<a href="https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0/query?where=pop2000+%3E+500000&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson" target="_blank">Here</a> is an example to get you started)
      <!-- Another example URL: -->
      <!-- https://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson -->
      </p>
    </div>
  
    <div id="app" class="csvForm container-fluid">
      <div class="row">
        <div class="col-sm">
          <json-to-geojson-form placeholder="Put ArcGIS JSON here" @geojson="onGeoJson"></json-to-geojson-form>
        </div>
        <div class="col-sm">
          <!-- todo: map goes here? -->
          <div id="app" style="height: 100%">
            <v-map ref="map" :zoom="13" :center="[47.413220, -1.219482]" :geojson="geojson" v-show="geojson" >
            </v-map>
          </div>
        </div>
      </div>
    </div>
  
    <footer>
      <!-- TODO - add bookmarklet link back when we get this working -->
      <a class="github-button" href="https://github.com/gavinr/arcgis-json-to-geojson" data-show-count="true" aria-label="Star gavinr/arcgis-json-to-geojson on GitHub">Star</a><br />
      Also: <A href="http://csv.togeojson.com">CSV to GeoJSON</a>
    </footer>
  </div>
</template>

<script>
import GithubButtons from "./assets/buttons.js";  // eslint-disable-line no-unused-vars
import JsonToGeojsonForm from "./components/JsonToGeojsonForm";
import LeafletMap from './components/LeafletMap';

export default {
  name: 'app',
  data () {
    return {
      title: 'Convert ArcGIS JSON to GeoJSON',
      geojson: false
    }
  },
   components: {
    'json-to-geojson-form': JsonToGeojsonForm,
    'v-map': LeafletMap
  },
  methods: {
    onGeoJson: function(evt) {
      this.geojson = JSON.parse(JSON.stringify(evt));
      // https://github.com/KoRiGaN/Vue2Leaflet/issues/96#issuecomment-341459943
      setTimeout(function() { window.dispatchEvent(new Event('resize')) }, 250);
    }
  }
}
</script>

<style lang="scss">
@import '~bootstrap/dist/css/bootstrap.css';

html, body {
  margin: 20px;
  font-family: 'Roboto', sans-serif;
}

footer,
footer a {
  color: #C0C0C0;
  size: 0.8rem;
  text-align: center;
  margin-top: 30px;
}
</style>
