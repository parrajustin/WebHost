'use strict';

// make `.jsx` file requirable by node
require('node-jsx').install();

var path        = require('path')
  , store     = require('node-persist')
  , express     = require('express')
  , renderer    = require('react-engine')
  , compression = require('compression')
  , app         = express();

// create the view engine with `react-engine`
var engine = renderer.server.create({
  routes: require(path.join(__dirname + '/public/routes.jsx')),
  routesFilePath: path.join(__dirname + '/public/routes.jsx')
});


console.log('');
console.log('SERVER RUNNING IN: ' + process.env.NODE_ENV);
console.log('');
console.log('');













// ================ JSON STORAGE SETUP ================
store.initSync({
  dir: '../../../../storage/',
  stringify: JSON.stringify,
  parse: JSON.parse,
  encoding: 'utf8',
  logging: true,
  continuous: true,
  interval: false,
  ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS
});

var data = {
  id: '0',
  author: 'test',
  msg: 'this is the msg'
};

var data2 = {
  id: '1',
  author: 'other',
  msg: 'this is the other msg'
};

store.setItem('chat-0', data);
store.setItem('chat-1', data2);
store.setItem('chat-num', '2');













// ================ EXPRESS SERVER SETUP ================
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
app.use(express.static(__dirname + '/public'));

//set compression
app.use(compression());


















// ================ EXPRESS ROUTES SETUP ================
app.get('*/api/msg', function(req, res) {
  var msgs = '{';
  for( var i = 0; i < store.getItem('char-num'); i++ ) {
    if( i != 0 ) {
      msgs += ', ';
    }
    msgs += i + ': ' + store.getItem('char-'+i);
  }
  msgs+= '}';
  res.send(msgs);
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

app.get('*', function(req, res) {
  res.render(req.url, {
    title: 'Fuzzion Media Group',
    name: 'home'
  });
});

// 404 template
// app.use(function(req, res) {
//   res.render('404', {
//     title: 'React Engine Express Sample App',
//     url: req.url
//   });
// });

app.use(function(err, req, res, next) {
  console.error(err);

  // http://expressjs.com/en/guide/error-handling.html
  if (res.headersSent) {
    return next(err);
  }

  if (err._type && err._type === ReactEngine.reactRouterServerErrors.MATCH_REDIRECT) {
    return res.redirect(302, err.redirectLocation);
  }
  else if (err._type && err._type === ReactEngine.reactRouterServerErrors.MATCH_NOT_FOUND) {
    return res.status(404).render(req.url);
  }
  else {
    // for ReactEngine.reactRouterServerErrors.MATCH_INTERNAL_ERROR or
    // any other error we just send the error message back
    return res.status(500).render('500.jsx', {
      err: {
        message: err.message,
        stack: err.stack
      }
    });
  }
})
















// ================ SERVER LISTEN SETUP ================
var server = app.listen(80, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
