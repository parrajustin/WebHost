#!/usr/bin/env node
var express = require('express');
var http = require('http');
// var https = require('https');
var app = express();
// var fs = require('fs');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.all('*', function(req, res, next){
  // 	if (req.secure) {
		// return next();
  // 	};
	if (!req.secure) {
    	return next();
  	};
  //res.redirect('https://localhost:'+HTTPS_PORT+req.url);
  //res.redirect('https://'+req.hostname+':'+HTTPS_PORT+req.url);
  res.redirect('http://'+req.hostname+req.url);
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
app.get('/home.css', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	res.sendFile('/css/home.css', options, function(err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		}
	});
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

var HTTP_PORT = 80;
//var HTTPS_PORT = 443;

// var options = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
//     //pfs: fs.readFileSync('server.p12')
// };

// var secureServer = https.createServer(options, app).listen(HTTPS_PORT, function(){
//   console.log("Secure Express Server listening on port " + HTTPS_PORT);
// });

var insecureServer = http.createServer(app).listen(HTTP_PORT, function() {
  console.log('Insecure Express Server listening on port ' + HTTP_PORT);
})