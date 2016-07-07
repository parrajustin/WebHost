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
var Error404 = require('./views/404.jsx');

var routes = module.exports = (
	<Router>
		<Route path='/' component={Layout}>
  			<IndexRoute component={Home} />
  			<Route path='/account' component={Account} />
  			<Redirect from='/home' to='/' />
  			<Route path='*' component={Error404}/>
		</Route>
	</Router>
);
