'use strict';

var React = require('react');
var util = require('util');

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    console.log("Just a check " + this.props.url);
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      type: 'GET',
      success: function(data) {
        console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    console.log('sent');
    // var comments = this.state.data;
    // // Optimistically set an id on the new comment. It will be replaced by an
    // // id generated by the server. In a production application you would likely
    // // not use Date.now() for this and would have a more robust system in place.
    // comment.id = Date.now();
    // var newComments = comments.concat([comment]);
    // this.setState({data: newComments});
    // $.ajax({
    //   url: this.props.url,
    //   dataType: 'json',
    //   type: 'POST',
    //   data: comment,
    //   success: function(data) {
    //     this.setState({data: data});
    //   }.bind(this),
    //   error: function(xhr, status, err) {
    //     this.setState({data: comments});
    //     console.error(this.props.url, status, err.toString());
    //   }.bind(this)
    // });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    console.log("mkay");
    return (
      <div className="chat_Body">
      </div>
    );
  }
});

module.exports = React.createClass({
  render: function render() {
    return (
      <div className='chat_Container'>
        <CommentBox url ='/api/comments' pollInterval={2000}/>
      </div>
    );
  }
});
