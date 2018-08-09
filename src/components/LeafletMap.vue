<template>
  <div class="component"></div>
</template>

<script>
import L from 'leaflet';
import * as esri from 'esri-leaflet';
L.esri = esri;

// BUG https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-319569682
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

export default {
  name: 'LeafletMap',
  data() {
    return {};
  },
  components: {
  },
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    minZoom: {
      type: Number,
      default: undefined,
    },
    maxZoom: {
      type: Number,
      default: undefined,
    },
    center: {
      type: Array,
      default: function() {
        return [-122, 38];
      },
    },
    zoom: {
      type: Number,
      default: 8,
    },
    // basemap: {
    //   type: String,
    //   required: true,
    //   default: 'streets',
    // },

    geojson: {
      // type: Object,
      default: () => ({})
    }
  },

  watch: {
    geojson: {
      handler(newVal) {
        if(this.layer) {
          this.mapObject.removeLayer(this.layer);
        }
        this.addGeoJSONData(newVal);
      },
      deep: true,
    },
  },


  mounted() {
    const options = this.options;
    Object.assign(options, {
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
    });
    if (this.center != null) {
      options.center = this.center;
    }
    if (this.zoom != null) {
      options.zoom = this.zoom;
    }

    this.mapObject = L.map(this.$el, options);

    L.esri.basemapLayer('Topographic').addTo(this.mapObject);
  },
  methods: {
    addGeoJSONData(geojsonData) {
      // cannot figure out what event to use here instead of setTimeout:
      setTimeout(function() {
        this.mapObject.fitBounds(this.layer.getBounds());
      }.bind(this), 800);
      
      this.layer = L.geoJSON(geojsonData, {
        onEachFeature: function (feature, layer) {
          let popupString = '';
          for(let key in feature.properties) {
            popupString = `${popupString}<strong>${key}</strong>: ${feature.properties[key]}<br />`;
          }
          layer.bindPopup(popupString);
        }
      });
      this.layer.addTo(this.mapObject);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "~leaflet/dist/leaflet.css";

  .component {
    background-color: gray;
    height: 100%;
    min-height: 300px;
  }
</style>