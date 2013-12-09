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


// CORS - for bookmarklet to work. If you don't want to support the bookmarklet, you can remove this section.
server.use(restify.fullResponse()); // needed for CORS to work
function unknownMethodHandler(req, res) {
	if (req.method.toLowerCase() === 'options') {
		// received an options method request
		var allowHeaders = ['accept', 'content-type', 'x-requested-with']; // added Origin & X-Requested-With

		if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');
		res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
		res.header('Access-Control-Allow-Methods', res.methods.join(', '));
		res.header('Access-Control-Allow-Origin', req.headers.origin);
		return res.send(200);
	} else
		return res.send(new restify.MethodNotAllowedError());
}

server.on('MethodNotAllowed', unknownMethodHandler);
// /end CORS



// ROUTES
server.get(/\/?.*/, restify.serveStatic({
	directory: './static',
	default: 'index.html'
}));
server.post('/agsJSON', agsJSON.toGeoJSON);

// Start the server
server.listen(process.env.VMC_APP_PORT || 8747, function() {
	console.log('%s listening at %s', server.name, server.url);
});