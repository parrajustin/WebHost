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

        classHeaderBar: 'header_Bar',
        classHeaderLogo: 'header_Logo'
      };
  },
  classNavBut: function () {
    if( !!$.os.phone || !!$.os.phone ) {
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
    if( !!$.os.phone || !!$.os.phone ) {
      this.setState({
        classDropDown: className('header_Nav_Drop', 'header_Nav_Hidden')
      });
      window.clearTimeout(this.state.delayId);
    }
  },
  componentDidMount: function () {
    if(!!$.os.phone || !!$.os.tablet) {
      this.setState({
        classNav: 'header_Nav_Mobile',
        classNavBut: className({'header_Nav_Button': true, 'header_Nav_ButtonHighlight': this.state.isPressed || this.state.isHovered}),
        classDropDown: className('header_Nav_Drop', 'header_Nav_Hidden'),
        classVSpacers: 'header_Nav_Hidden',
        classNavSelect: 'header_NavSelect_Mobile',
        classNavSelectActive: 'header_NavActive_Mobile',
        classHSpacers: 'header_NavSpaceH',

        classHeaderBar: 'header_Bar_Mobile',
        classHeaderLogo: 'header_Logo_Mobile'
      });
    }
    this.forceUpdate();
  },
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
            <div className={this.state.classHeaderBar}>
              <div className={this.state.classHeaderLogo}>Fuzzion</div>
              <div className={this.state.classNav}>
                <button onClick={this.dropDown} className={this.state.classNavBut}><i className="icon">&#xf0c9;</i></button>
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

          {this.props.children}
        </body>
      </html>
    );
  }
});
