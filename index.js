var express = require('express'),
	app = express(),
	http = require('http'),
	https = require('https'),
	fs = require('fs');

var port = 8000;

var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

var server = https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});

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