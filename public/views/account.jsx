'use strict';

var React = require('react');

module.exports = React.createClass({

  displayName: 'account',

  render: function render() {

    return (
      <div id='account'>
        <h1>Hello {this.props.name}</h1>
        <h6>I am a React Router rendered view</h6>
        <a href='/some_unknown'>Click to go to an unhandled route</a>
      </div>
    );
  }
});
