var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');

https.createServer({
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
}, app).listen(80);

//Home
app.get('/', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	res.sendFile('/WebHome/index.html', options, function(err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		}
	});
});

//Home css
app.get('/style.css', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	res.sendFile('/WebHome/style.css', options, function(err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		}
	});
});