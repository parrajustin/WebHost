/*-------------------------------------------------------------------------------------------------------------------*\
|  Copyright (C) 2015 PayPal                                                                                          |
|                                                                                                                     |
|  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance     |
|  with the License.                                                                                                  |
|                                                                                                                     |
|  You may obtain a copy of the License at                                                                            |
|                                                                                                                     |
|       http://www.apache.org/licenses/LICENSE-2.0                                                                    |
|                                                                                                                     |
|  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed   |
|  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for  |
|  the specific language governing permissions and limitations under the License.                                     |
\*-------------------------------------------------------------------------------------------------------------------*/

'use strict';

// make `.jsx` file requirable by node
require('node-jsx').install();

var path        = require('path');
var express     = require('express');
var renderer    = require('react-engine');
var compression = require('compression');
var app         = express();

// create the view engine with `react-engine`
var engine = renderer.server.create({
  routes: require(path.join(__dirname + '/public/routes.jsx')),
  routesFilePath: path.join(__dirname + '/public/routes.jsx')
});

if (process.env.NODE_ENV === "development") {
  console.log('Development Mode');
} else {
  console.log('Production Mode');
}





// set the engine
app.engine('.jsx', engine);

// set the view directory
app.set('views', __dirname + '/public/views');

// set jsx as the view engine
app.set('view engine', 'jsx');

// finally, set the custom view
app.set('view', renderer.expressView);

//expose public folder as static assets
app.use(express.static(__dirname + '/resources'));

//set compression
app.use(compression());







app.get('/', function(req, res) {
  res.render(req.url, {
    title: 'Fuzzion Home',
    name: 'home'
  });
});

app.get('/home', function(req, res) {
  res.render(req.url, {
    title: 'Fuzzion Home',
    name: 'home'
  });
});

app.get('/account', function(req, res) {
  res.render(req.url, {
    title: 'Fuzzion Home',
    name: 'home'
  });
});

app.get('*/api/comment', function(req, res) {
  res.send('[{id:1,text:"This is a test"},{id:2,text:"test2"}]');
});

app.get('*/resources/:fileName', function(req, res) {
  var options = {
    root: __dirname,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  res.sendFile('/resources/' + req.params.fileName, options, function(err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
});

// 404 template
app.use(function(req, res) {
  res.render('404', {
    title: 'React Engine Express Sample App',
    url: req.url
  });
});







var server = app.listen(80, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
