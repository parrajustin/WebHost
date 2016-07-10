'use strict';

var React     = require('react')
  , className = require('classnames')
  , util      = require('util');

var ChatBody = React.createClass({
  fetchMessages: function() {
    console.log("launching Ajax Call");
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
    // $.ajax({
    //   url: this.props.url,
    //   dataType: 'json',
    //   contentType: 'application/json',
    //   type: 'POST',
    //   data: JSON.stringify(comment),
    //   success: function(data) {
    //     console.log(data);
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
    this.fetchMessages();
    setInterval(this.fetchMessages, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="chat_Body">
        <Messages data={this.state.data} />
        <MsgForm url='localhost/api/msg' onMsgSubmit={this.handleMsgSubmit} />
      </div>
    );
  }
});

var Messages = React.createClass({
  getInitialState: function() {
    return {
      classUpperSection: className('chat_UpperSection', 'chat_UpperSection_Height')
    };
  },
  componentDidMount: function () {
    if(!!$.os.phone || !!$.os.tablet) {
      this.setState({
        classUpperSection: className('chat_UpperSection', 'chat_UpperSection_Height_Mobile')
      });
    }
    this.forceUpdate();
  },
  render: function() {
    var seperateMsgs = this.props.data.map(function(msgData) {
      return (
        <Msg author={msgData.author} actualMsg={msgData.msg} key={msgData.id} />
      );
    });
    return (
      <div className={this.state.classUpperSection}>
        {seperateMsgs}
      </div>
    );
  }
});

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

var MsgForm = React.createClass({
  getInitialState: function() {
    return {
      author: '', 
      text: '',
      classChatAuthor: 'chat_Input',
      classChatInput: className('chat_Input', 'chat_Input_Hidden'),
      classLowerSection: 'chat_LowerSection'
    };
  },
  handleAuthorChange: function(e) {
    if( this.state.classChatAuthor === 'chat_Input' ) {
      this.setState({author: e.target.value});
    }
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  componentDidMount: function () {
    if(!!$.os.phone || !!$.os.tablet) {
      this.setState({
        classLowerSection: 'chat_LowerSection_Mobile'
      });
    }
    this.forceUpdate();
  },
  handleSubmit: function(e) {
    if( this.state.classChatAuthor === 'chat_Input' ) {
      if( this.state.author.trim() === '' ) {
        return;
      }
      this.setState({
        classChatAuthor: className('chat_Input', 'chat_Input_Hidden'),
        classChatInput: className('chat_Input','chat_Input_Loc')
      });
    }
    else {
      if( this.state.text.trim() === '' ) {
        return;
      }
      var dataHold = {
        author: this.state.author.trim(),
        msg: this.state.text.trim()
      }
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(dataHold),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
      this.props.onMsgSubmit(dataHold);
      this.setState( {
        text: ''
      })
    }
  },
  render: function() {
    var iconClass = className('chat_Post_Icon', 'icon');
    return (
      <form className={this.state.classLowerSection}>
        <input
          className={this.state.classChatAuthor}
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          className={this.state.classChatInput}
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <div className="chat_Post" onClick={this.handleSubmit}><i className={iconClass} >&#xf124;</i></div>
      </form>
    );
  }
});

module.exports = React.createClass({
  getInitialState: function() {
    return {
      test: 'WOKRS'
    };
  },
  render: function render() {
    return (
      <div className='chat_Container'>
        <ChatBody url='/api/msg' pollInterval={2000}/>
      </div>
    );
  }
});
