import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import { Link } from 'react-router';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {}
    }
  }
  onLogout() {
    Accounts.logout();
  }
  componentDidMount() {
    this.userTracker = Tracker.autorun(() => {
      if (Meteor.user()) {
        this.setState({
          currentUser: Meteor.user()
        })
      }
    })
  }
  componentWillUnmount() {
    this.userTracker.stop();
  }
  renderUser() {
    if (this.state.currentUser.profile != null) {
      return <img style={{width: '64px', height: '64px'}} src={this.state.currentUser.profile.photoURL} />
    } 
  }
  render() {
    return (
      <div>
        <h1>App Component</h1> 
        <p>{ this.renderUser() }</p>
        <button onClick={this.onLogout.bind(this)}>Logout</button>
        <button>Add Message</button>
      </div>
    );
  };
}


