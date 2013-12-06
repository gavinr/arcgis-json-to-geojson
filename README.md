ArcGIS JSON to GeoJSON
======================

Need to convert some ArcGIS JSON to GeoJSON? This is a simple project that helps you do that.

Example/Production site: http://arcgis-json-to-geojson.aws.af.cm/


Installation
--------

	npm install
	node server.js

Then visit http://localhost:8080/

Bookmarklet Guide
--------
Drag the bookmarklet to your browser's links bar, and suddenly you have a 1-click way to convert a page of ArcGIS JSON to GeoJSON. Once the bookmarklet is in your browser's toolbar, simply visit a page that has ONLY ArgGIS JSON (like a query results page with format=JSON, and outSpatialRef=4326, like [this](http://maps.gis.co.brown.wi.us/arcgis/rest/services/Sirens/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson) for example), and click the button. The page contents will change to GeoJSON!

Credit
------

* [Restify](http://mcavage.me/node-restify/)
* [Esri Terraformer](https://github.com/Esri/Terraformer)


Feedback
--------

File bug reports here on GitHub or contact [Gavin Rehkemper](http://github.com/gavreh) [(gavinrehkemper @ twitter)](http://twitter.com/gavinrehkemper) for anything else.

License
-------
http://creativecommons.org/licenses/by-sa/3.0/
