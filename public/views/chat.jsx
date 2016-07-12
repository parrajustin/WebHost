'use strict';

var React     = require('react')
  , className = require('classnames')
  , util      = require('util');

var ChatBody = React.createClass({
  getInitialState: function() {
    return {
      cNum: '-1',
      data: []
    };
  },
  fetchMessages: function() {
    // console.log("launching Ajax Call");
    var xhrTemp = $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      type: 'GET',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.props.notification("Failed to send message!");
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    this.setState({xhr: xhrTemp});
  },
  handleMsgSubmit: function(comment) {
    var comments = this.state.data;
    console.log(this.state.data.length + JSON.stringify(this.state.data));
    comment.id = Number(this.state.cNum);
    this.setState({
      cNum: (Number(this.state.cNum) - 1)
    })
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
  },
  componentDidMount: function() {
    this.fetchMessages();
    var Id = setInterval(this.fetchMessages, this.props.pollInterval);
    this.setState({
      refreshId: Id
    })
  },
  render: function() {
    return (
      <div className="chat_Body">
        <Messages data={this.state.data} />
        <MsgForm url='localhost/api/msg' onMsgSubmit={this.handleMsgSubmit} />
      </div>
    );
  },
  componentWillUnmount: function () {
    clearInterval(this.state.refreshId);
    if( this.state.xhr != undefined ) {
      this.state.xhr.abort()
    }
  }
});

var Messages = React.createClass({
  getInitialState: function() {
    return {
      classUpperSection: className('chat_UpperSection', 'chat_UpperSection_Height')
    };
  },
  componentDidMount: function () {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
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
  componentDidMount: function () {
    $(function() {
      $("loadingId" + this.props.key).mousetip('.tip');
    });
  },
  render: function() {
    var icons = className('icon', 'animate-spin', 'chat_Msg_Icon');
    var idHold = "loadingId" + this.props.key;
    return (
      <div className="chat_Msg">
        <i id={idHold} className={icons}>&#xf123; <span className="tip">Sending Message...</span></i>
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
      classLowerSection: 'chat_LowerSection',
      classChatPost: className('chat_Post', 'chat_PostRed')
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
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      this.setState({
        classLowerSection: 'chat_LowerSection_Mobile'
      });
    }
    this.forceUpdate();
  },
  changeColor: function() {
    this.setState({
      classChatPost: className('chat_Post', 'chat_PostRed')
    });
  },
  handleSubmit: function(e) {
    //Handle changing colors
    // try {
    //   var temp;
    //   for( temp in e.target) break; //will get the first object name
    //   var temp = e.target[temp];  //will set that object to a variable
    //   console.log("2"+temp._currentElement.type+"-");
    //   console.log(temp._currentElement.type === 'div');
    // } catch(err) {
    //   console.log(err.message);
    // }
    // if( e.target.tagName == 'div' ) {
    // }
    if( ( (this.state.classChatAuthor === 'chat_Input' && !(this.state.author.trim() === '')) || !(this.state.text.trim() === '') ) && 
      ( this.state.classChatPost == className('chat_Post', 'chat_PostRed') ) 
      ) {
      window.clearTimeout(this.state.delayId);
      this.setState({
        classChatPost: className('chat_Post', 'chat_PostBlack'),
        delayId: window.setTimeout(this.changeColor, 500)
      });
    }

    //Handle submit
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
      var xhrT = $.ajax({
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
        xhr: xhrT,
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
          placeholder="What is your name?"
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
        <div className={this.state.classChatPost} onClick={this.handleSubmit}><i className={iconClass} >&#xf124;</i></div>
      </form>
    );
  },
  componentWillUnmount: function () {
    if( this.state.xhr != undefined ) {
      this.state.xhr.abort()
    }
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
        <ChatBody url='/api/msg' notification={this.props.notification} pollInterval={2000}/>
      </div>
    );
  }
});
