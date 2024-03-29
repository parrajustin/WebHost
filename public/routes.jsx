'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Redirect = ReactRouter.Redirect;

var Layout = require('./views/layout.jsx'),
	Account = require('./views/account.jsx'),
	Home = require('./views/home.jsx'),
	Chat = require('./views/chat.jsx'),
	Error404 = require('./views/404.jsx');

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
