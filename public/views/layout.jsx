'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var IndexLink = ReactRouter.IndexLink;

module.exports = React.createClass({
  render: function render() {
    return (
      <html>
        <head>
          <meta charSet='utf-8' />
          <link href='https://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' type='text/css'/>
          <link rel="stylesheet" href="/resources/style.css"/>
          <script src='/bundle.js'></script>
          <title>
            {this.props.title}
          </title>
        </head>
        <body>
          <div className='header_Container'>
            <div className='header_Bar'>
              <div className='header_Logo'>Fuzzion</div>
              <div className='header_Nav'>
                <Link className='header_NavSelect' activeClassName='header_NavActive' to='/chat'>Chat</Link>
                <div className='header_NavSpace'> | </div>
                <Link className='header_NavSelect' activeClassName='header_NavActive' to='/account'>Account</Link>
                <div className='header_NavSpace'> | </div>
                <IndexLink className='header_NavSelect' activeClassName='header_NavActive' to='/'>Home</IndexLink>
              </div>
            </div>
          </div>

          {this.props.children}
        </body>
      </html>
    );
  }
});
