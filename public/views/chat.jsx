'use strict';

var React = require('react');
var util = require('util');

var Msg = React.createClass({
  render: function() {
    return (
      <div className="chat_Msg">
        <h2>
          {this.props.author}
        </h2>
        {this.props.actualMsg}
      </div>
    );
  }
});

var ChatBody = React.createClass({
  fetchMessages: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      type: 'GET',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleMsgSubmit: function(comment) {
    var comments = this.state.data;
    comment.id = '-1';
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify(comment),
      success: function(data) {
        console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.fetchMessages();
    setInterval(this.fetchMessages, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="chat_Body">
        <Messages data={this.state.data} />
        <MsgForm onMsgSubmit={this.handleMsgSubmit} />
      </div>
    );
  }
});

var Messages = React.createClass({
  render: function() {
    var seperateMsgs = this.props.data.map(function(msgData) {
      return (
        <Msg author={msgData.author} actualMsg={msgData.msg} key={msgData.id} />
      );
    });
    return (
      <div className="chat_UpperSection">
        {seperateMsgs}
      </div>
    );
  }
});

var MsgForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onMsgSubmit({author: author, msg: text});
    this.setState({author: this.state.author, text: ''});
  },
  render: function() {
    return (
      <form className="chat_LowerSection" onSubmit={this.handleSubmit}>
        <input
          className="chat_Input"
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          className="chat_Input"
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input className="chat_Post" type="submit" value="Post" />
      </form>
    );
  }
});

module.exports = React.createClass({
  render: function render() {
    return (
      <div className='chat_Container'>
        <ChatBody url='localhost/api/msg' pollInterval={2000}/>
      </div>
    );
  }
});
