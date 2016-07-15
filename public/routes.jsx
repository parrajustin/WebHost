'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Redirect = ReactRouter.Redirect;

var Layout = require('./views/layout.jsx');
var Account = require('./views/account.jsx');
var Home = require('./views/home.jsx');
var Chat = require('./views/chat.jsx');
var Error404 = require('./views/404.jsx');

if (!(process.env.NODE_ENV === "development ")) {
	var Layout = require('./views/layout.min.js');
	var Account = require('./views/account.min.js');
	var Home = require('./views/home.min.js');
	var Chat = require('./views/chat.min.js');
	var Error404 = require('./views/404.min.js');
}

var routes = module.exports = (
	<Router>
		<Route path='/' component={Layout}>
  			<IndexRoute component={Home} />
  			<Route path='/account' component={Account} />
  			<Route path='/chat' component={Chat} />
  			<Redirect from='/home' to='/' />
  			<Route path='*' component={Error404}/>
		</Route>
	</Router>
);
