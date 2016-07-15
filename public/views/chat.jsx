'use strict';

var React     = require('react')
  , className = require('classnames')
  , util      = require('util');

var storage = {
  ajaxOut: undefined, //keeps track of current ajax posts; sturcture = [[ajaxObject,[messageContent],......]
  ajaxMessages: undefined, //MESSAGES to be sent by the ajax post, not messages being currently sent!
  ajaxLastMsgSent: undefined,
  ajaxTimeoutId: undefined //AJAX 600ms RECALL, to make sure messages are sent at the max of 600 ms from the last call
};

var msgs = undefined; //keeps track of messages
var oldMsg = undefined; 


















var ChatBody = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      xhr: { pointer: undefined, check: false}
    };
  },
  compare: function(a,b) {
    if (a["time"] < b["time"])
      return -1;
    if (a["time"] > b["time"])
      return 1;
    return 0;
  },
  fixDataTemp: function(ms) {
    oldMsg = (oldMsg == undefined? [ms]:oldMsg.concat(ms));
    this.setState({
      data: oldMsg
    });
  },
  fixData: function(recievedData) {
    if( msgs != undefined && msgs.length == 0 ) { msgs = undefined; }
    if( msgs != undefined ) {
      msgs = msgs.sort(this.compare);

      var x = msgs.length-1;
      var holder = msgs[0]["time"];
      for( var i = recievedData.length -1; recievedData[i]["time"] >= holder; i-- ) {
        if( recievedData[i]["time"] < msgs[x]["time"] ) { x -= 1; i+= 1; continue; } 
        else if( recievedData[i]["hash"] == msgs[x]["hash"]) { msgs.splice(x,1); }
      }
      if( msgs.length == 0 ) { msgs = undefined; }
      oldMsg = recievedData.concat(msgs);
      return oldMsg;
    }
    oldMsg = recievedData;
    return oldMsg;
  },
  fetchMessages: function() {
    if( this.state.xhr.pointer == undefined ) {
      var xhrTemp = $.ajax({
        url: this.props.url,
        dataType: 'json',
        cache: false,
        type: 'GET',
        success: function(data) {
          this.setState({data: this.fixData(data.sort(this.compare)), xhr: { pointer: undefined, check: false }});
        }.bind(this),
        error: function(xhr, status, err) {
          this.props.notification("Failed to send message!");
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
      this.setState({xhr: { pointer: xhrTemp, check: false}});
    } else if(!this.state.xhr.check) {
      this.setState({xhr: { pointer: this.state.xhr.pointer, check: true}});
    } else {
      try {
        this.state.xhr.pointer.abort()
      } catch(err) {} //IDK what if it finishes before this 
      this.setState({
        xhr: { pointer: undefined, check: false}
      });
      this.fetchMessages();
    }
  },
  handleMsgSubmit: function(comment) {
    // var comments = this.state.data;
    comment.id = Number((msgs == undefined? -1: msgs.length * -1));
    // var newComments = comments.concat([comment]);
    // this.setState({data: newComments});
    console.log(JSON.stringify(msgs));
    msgs = (msgs == undefined? [comment]: msgs.concat[comment]);
    console.log(JSON.stringify(msgs));
    this.fixDataTemp(msgs);
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
    if( this.state.xhr.pointer != undefined ) {
      this.state.xhr.pointer.abort()
    }
  },
});
















var Messages = React.createClass({
  getInitialState: function() {
    return {
      classUpperSection: className('chat_UpperSection', 'chat_UpperSection_Height')
    };
  },
  componentDidMount: function () {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || $(window).width() <= 500) {
      this.setState({
        classUpperSection: className('chat_UpperSection', 'chat_UpperSection_Height_Mobile')
      });
    }
  },
  render: function() {
    var seperateMsgs = this.props.data.map(function(msgData) {
      if( msgData == undefined ) { return; } //Not too sure why an undefined object is put into the data but it happens so this is needed
      return (
        <Msg author={msgData.author} hash={msgData.hash} actualMsg={msgData.msg} id={msgData.id} key={msgData.id} />
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
  getInitialState: function () {
      var idHold = "loadingId_" + this.props.hash;
      return {
        iconId: idHold
      };
  },
  render: function() {
    var icons = className('icon', 'animate-spin', 'chat_Msg_Icon');
    var iconStyle = {display: 'none'};
    if( Number(this.props.id) < 0 ) {
      iconStyle = {};
    }
    return (
      <div className="chat_Msg">
        <i id={this.state.iconId} style={iconStyle} className={icons}>&#xf123;</i>
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
      author: '', //The Author of the messages
      text: '', //The message currently contined in the input field

      classChatAuthor: 'chat_Input', //the current class for the author input field
      classChatInput: className('chat_Input', 'chat_Input_Hidden'), //the current class names for the chat input field
      classLowerSection: 'chat_LowerSection', //the current css class name for lower section of the chat block
      classChatPost: className('chat_Post', 'chat_PostRed') //the current css class name for the button to send messages
    };
  },
  /**
   * Called whenever the author input field changes value
   * @param  {[type]} e The event object
   */
  handleAuthorChange: function(e) {
    if( this.state.classChatAuthor === 'chat_Input' ) {
      this.setState({author: e.target.value});
    }
  },
  /** Caled whenever the text input field changes value */
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  /** called once when the component is mounted on the client side */
  componentDidMount: function () {
    /** changes css sections that have mobile counterparts to those other versions */
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || $(window).width() <= 500) {
      this.setState({
        classLowerSection: 'chat_LowerSection_Mobile'
      });
    }
  },
  /**
   * Is called when the post button needs to be changed back to the normal red color
   */
  changeColor: function() {
    this.setState({
      classChatPost: className('chat_Post', 'chat_PostRed')
    });
  },
  /**
   * Is used to handle getting rid of old ajax calls that are being held onto by the state object, or move messages that failed to get sent back into the pool of messages
   * @param  {[type]} obj the jquery ajax xhr refrence object
   * @return {[type]}     [description]
   */
  ajaxHandler: function (objRef,passOrfail) {
    if( storage.ajaxOut == undefined) {
      console.error('THIS SHOULDN\'T HAPPEN, ERROR CODE: \'aHnoAo\'');
      return;
    }
    if( passOrfail ) {
      for( var i = 0; i < storage.ajaxOut.length; i++ ) {
        var ob = storage.ajaxOut[i];
        if( JSON.stringify(objRef) === JSON.stringify(ob[0]) ) {
          storage.ajaxOut.splice(i,1);
          if( storage.ajaxOut.length == 0) {storage.ajaxOut = undefined;}
          this.ajaxCall();
          return;
        }
      }
    } else {
      for( var i = 0; i < this.state.ajaxOut.length; i++ ) {
        var ob = storage.ajaxOut[i];
        if( JSON.stringify(objRef) === JSON.stringify(ob[0]) ) {
          var messagesTemp = ob[1];
          try {ob[0].abort();}catch(err){}
          storage.ajaxMessages = (storage.ajaxMessages == undefined? messagesTemp: storage.ajaxMessages.concat(messagesTemp));
          storage.ajaxOut.splice(i,1);
          if( storage.ajaxOut.length == 0) {storage.ajaxOut = undefined;}
          this.ajaxCall();
          return;
        }
      }
    }
  },
  /**
   * called to send an ajax post message, will only happen if a message is trying to be sent before 400ms or if a 600ms call has happened
   * @return {[type]} [description]
   */
  ajaxCall: function() {
    //console.log('test1 ' + (storage.ajaxOut == undefined || storage.ajaxOut.length <= 2) + " " +  (storage.ajaxMessages != undefined) + " " + (storage.ajaxLastMsgSent == undefined || new Date().getTime() - storage.ajaxLastMsgSent > 200));
    /** Checks to see if there are messages that need to be sent */
    if ((storage.ajaxOut == undefined || storage.ajaxOut.length <= 2) && storage.ajaxMessages != undefined && (storage.ajaxLastMsgSent == undefined || new Date().getTime() - storage.ajaxLastMsgSent > 200) ) { 
      //console.log('test2');
      window.clearTimeout(storage.ajaxTimeoutId); // will stop this timeout from working so that I may reset it
      var xhrT = $.ajax({
        url: this.props.url,
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(storage.ajaxMessages),
        success: function(data) {
          this.ajaxHandler(xhrT,true);
        }.bind(this),
        error: function(xhr, status, err) {
          this.ajaxHandler(xhrT,false);
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
      storage.ajaxOut = (storage.ajaxOut == undefined? [[xhrT,storage.ajaxMessages]]: storage.ajaxOut.push([xhrT,storage.ajaxMessages]));
      storage.ajaxTimeoutId = window.setTimeout(this.ajaxCall, 250);
      storage.ajaxLastMsgSent = new Date().getTime();
      storage.ajaxMessages = undefined;
    } else if( storage.ajaxOut != undefined && storage.ajaxLastMsgSent != undefined && new Date().getTime() - storage.ajaxLastMsgSent > 800 && storage.ajaxMessages != undefined) { //waited too long, the ajax calls must be staled or something
      var temp = storage.ajaxOut;
      var notSent = temp[0];
      this.ajaxHandler(notSent[0],false);
    } else if( storage.ajaxMessages != undefined ) {
      window.clearTimeout(storage.ajaxTimeoutId);
      storage.ajaxTimeoutId=window.setTimeout(this.ajaxCall, 350);
    } else { //No more messages to send, no reason to keep checking
      window.clearTimeout(storage.ajaxTimeoutId);
      storage.ajaxTimeoutId = undefined;
    }
  },
  /**
   * Called Whenever the post button is pushed on the msg form
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  handleSubmit: function(e) {
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
    if( this.state.classChatAuthor === 'chat_Input' ) { //Checks for the author, once the author has been specified the author input field is hidden and a new field appears
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

      //creates the message
      var saltHold = $(document).salt(32, 'aA#');
      var dataHold = {
        author: this.state.author.trim(),
        msg: this.state.text.trim(),
        salt: saltHold,
        time: new Date().getTime()
      };
      var hashHold = JSON.stringify(dataHold).hashCode();
      dataHold = {
        author: dataHold.author,
        msg: dataHold.msg,
        hash: Math.abs(hashHold),
        time: dataHold.time
      };

      //tries to send the message
      //console.log(JSON.stringify(dataHold));
      var temp = storage.ajaxMessages;
      //console.log(temp);
      //console.log("temp log |" + JSON.stringify(temp) + "| check: " + (temp == undefined) + " | " + (temp == [] + " | "));
      storage.ajaxMessages = (storage.ajaxMessages == undefined? [dataHold]: storage.ajaxMessages.concat(dataHold));
      //console.log(JSON.stringify(storage.ajaxMessages));
      this.ajaxCall();

      //calls the inhereted method onMsgSubmit as a pipline to its parent, this will send this msg off to be displayed as a temp msg
      this.props.onMsgSubmit(dataHold);
      this.setState( {
        text: ''
      });
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
    window.clearTimeout(this.state.ajaxTimeoutId);



    // this.setState({
    //   ajaxOut: [], 
    //   ajaxMessages: undefined, 
    //   ajaxLastMsgSent: undefined,
    //   ajaxTimeoutId: undefined
    // });
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
        <ChatBody url='/api/msg' notification={this.props.notification} pollInterval={1000}/>
      </div>
    );
  }
});
