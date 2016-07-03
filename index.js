var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('./WebHome/index.html');
});

app.listen(80);