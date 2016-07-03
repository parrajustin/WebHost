var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../WebHome', 'index.html'));
});

app.listen(80);