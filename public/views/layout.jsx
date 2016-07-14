'use strict';

var React       = require('react')
  , ReactRouter = require('react-router')
  , className   = require('classnames')
  , Link        = ReactRouter.Link
  , IndexLink   = ReactRouter.IndexLink;

module.exports = React.createClass({
  getInitialState: function () {
      return {
        classNav: 'header_Nav',
        classNavBut: 'header_Nav_NonButton',
        classDropDown: 'header_Empty',
        classVSpacers: 'header_NavSpace',
        classNavSelect: 'header_NavSelect',
        classNavSelectActive: 'header_NavActive',
        classHSpacers: 'header_Nav_Hidden',
        classIcon: 'header_Empty',
        classHeaderBar: 'header_Bar',
        classHeaderLogo: 'header_Logo',

        ncStyle: { top: '82px', display: 'none' },
        ncText: '',

        classNotificationBody: 'notification_Body'
      };
  },
  classNavBut: function () {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      var btnClass = className({
        'header_Nav_Button': true, 
        'header_Nav_ButtonHighlight': this.state.isPressed || this.state.isHovered
        });
      return btnClass;
    } else {
      return className('header_Nav_NonButton');
    }
  },
  dropDown: function () {
    if( !(this.state.classDropDown === 'header_Nav_Drop') ) {
      this.setState({
        classDropDown: 'header_Nav_Drop',
        delayId: window.setTimeout(this.dropDown, 8000)
      });
    } else {
      this.deadDrop();
    }
  },
  deadDrop: function () {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      this.setState({
        classDropDown: className('header_Nav_Drop', 'header_Nav_Hidden')
      });
      window.clearTimeout(this.state.delayId);
    }
  },
  componentDidMount: function () {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      this.setState({
        classNav: 'header_Nav_Mobile',
        classNavBut: className({'header_Nav_Button': true, 'header_Nav_ButtonHighlight': this.state.isPressed || this.state.isHovered}),
        classDropDown: className('header_Nav_Drop', 'header_Nav_Hidden'),
        classVSpacers: 'header_Nav_Hidden',
        classNavSelect: 'header_NavSelect_Mobile',
        classNavSelectActive: 'header_NavActive_Mobile',
        classHSpacers: 'header_NavSpaceH',
        classIcon: className('header_Nav_Icon', 'icon'),
        classHeaderBar: 'header_Bar_Mobile',
        classHeaderLogo: 'header_Logo_Mobile',

        ncStyle: { top: '132px', display: 'none' }
      });
    }

    $(document).on('scroll', 'notifId', this.handleScroll );

    this.forceUpdate();
  },
  handleScroll: function () {
    if( this.state.ncStyle.display === 'none' ) {
      return;
    }

    var topT;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) { topT = 132; } else { topT = 82; }
    topT = topT + $('#headId').position().top;
    if( topT <= 0 ) {
      topT = 0; 
    }

    this.setState({
      ncStyle: { top: topT }
    });
  },
  notifClick: function () {
    window.clearTimeout(this.state.notifDelayId);
    var topTemp = this.state.ncStyle.top;
    this.setState({
      ncStyle: { top: topTemp, display: 'none' }
    });
  },
  notification: function (textVar) {
    window.clearTimeout(this.state.notifDelayId);
    this.setState({
      ncStyle: { top: this.state.ncStyle.top },
      ncText: ( textVar || 'ERROR! UNKOWN!' )
    });
    this.handleScroll();
    this.setState({
      notifDelayId: window.setTimeout(this.notifClick, 2000)
    })
  },
  render: function render() {
    return (
      <html onScroll={this.handleScroll}>
        <head>
          <meta charSet='utf-8' />
          <link href='https://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' type='text/css'/>
          <link rel="stylesheet" href="/resources/style.css"/>
          <script src='/bundle.js'></script>
          <title>
            {this.props.title}
          </title>
        </head>
        <body onScroll={this.handleScroll}>
          <div id="headId" className='header_Container'>
            <div className={this.state.classHeaderBar}>
              <div className={this.state.classHeaderLogo}>Fuzzion</div>
              <div className={this.state.classNav}>
                <button onClick={this.dropDown} className={this.state.classNavBut}><i className={this.state.classIcon}>&#xf0c9;</i></button>
                <div id='header_Drop' className={this.state.classDropDown}>
                  <Link onClick={this.deadDrop} className={this.state.classNavSelect} activeClassName={this.state.classNavSelectActive} to='/chat'>Chat</Link>
                  <div className={this.state.classVSpacers}> | </div>
                  <div className={this.state.classHSpacers} />
                  <Link onClick={this.deadDrop} className={this.state.classNavSelect} activeClassName={this.state.classNavSelectActive} to='/account'>Account</Link>
                  <div className={this.state.classVSpacers}> | </div>
                  <div className={this.state.classHSpacers} />
                  <IndexLink onClick={this.deadDrop} className={this.state.classNavSelect} activeClassName={this.state.classNavSelectActive} to='/'>Home</IndexLink>
                </div>
              </div>
            </div>
          </div>
          <div id="notifId" onClick={this.notifClick} style={this.state.ncStyle} className='notification_Container'>
            <div className={this.state.classNotificationBody}>
              {this.state.ncText}
            </div>
          </div>

          {React.cloneElement(this.props.children, { notification: this.notification})}
        </body>
      </html>
    );
  }
});
