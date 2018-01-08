<template>
  <div id="app">
    <header>
      <h1>{{ title }}</h1>
    </header>
    
  
    <div class="instructions">
      <p>Copy in some ArcGIS JSON. (<a href="http://maps.gis.co.brown.wi.us/arcgis/rest/services/Sirens/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson">Here</a> is an example to get you started)
      </p>
    </div>
  
    <div id="app" class="csvForm">
        <json-to-geojson-form placeholder="Put ArcGIS JSON here"></json-to-geojson-form>
    </div>
  
    <footer>
      <!-- TODO - add bookmarklet link back when we get this working -->
      More info on <a href="https://github.com/gavinr/arcgis-json-to-geojson">GitHub</a><br />
      Also: <A href="http://csv.togeojson.com">CSV to GeoJSON</a>
    </footer>
  </div>
</template>

<script>
import JsonToGeojsonForm from "./JsonToGeojsonForm";

export default {
  name: 'app',
  data () {
    return {
      title: 'Convert ArcGIS JSON to GeoJSON'
    }
  },
   components: {
		'json-to-geojson-form': JsonToGeojsonForm
	}
}
</script>

<style lang="scss">
html, body {
	margin: 20px;
	font-family: 'Lato', sans-serif;
}

footer,
footer a {
	color: #C0C0C0;
	size: 0.8rem;
	text-align: center;
}
</style>
