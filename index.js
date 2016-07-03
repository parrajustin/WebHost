var express = require('express');
var app = express();

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
		else {
			console.log("========] HOME [========");
		}
	});
});

app.listen(80);