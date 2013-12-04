var restify = require('restify');
var agsJSON = require('./controller/agsJSON');

var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.throttle({
	burst: 100,
	rate: 50,
	ip: true,
	overrides: {
		'192.168.1.1': {
			rate: 0, // unlimited
			burst: 0
		},
		'0.0.0.0': {
			rate: 0, // unlimited
			burst: 0
		}
	}
}));
server.use(restify.conditionalRequest());

// ROUTES

server.get(/\/?.*/, restify.serveStatic({
  directory: './static',
  default:'index.html'
}));

server.post('/agsJSON', agsJSON.toGeoJSON);

server.listen(process.env.VMC_APP_PORT || 8080, function() {
	console.log('%s listening at %s', server.name, server.url);
});