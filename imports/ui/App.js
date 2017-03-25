import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import { Link } from 'react-router';
import { HTTP } from 'meteor/http';

import { Moments } from '../models/moments';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      content: '',
      error: '',
      moments: [],
      users: []
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

      const moments = Moments.find({}).fetch();
      this.setState({ moments });

      Meteor.users.find({}).fetch() ? this.setState({users: Meteor.users.find({}).fetch()}) : undefined;
    })
  }
  componentWillUnmount() {
    this.userTracker.stop();
  }
  shouldComponentUpdate() {
    if (!Meteor.userId()) {
      return false;
    }
    return true;
  }
  addMsg(e) {

    e.preventDefault();

    const content = this.refs.content.value;
    Meteor.call('moments.insert', content, (err, res) => {
      if (err) {
        this.setState({
          error: err.reason
        })
      }
    })
  }
  renderUser() {
    if (this.state.currentUser.profile != null) {
      return <img style={{width: '64px', height: '64px'}} src={this.state.currentUser.profile.photoURL} />
    } 
  }
  renderUserEmail() {
    if (this.state.currentUser.emails[0].address != null) {
      return <span>{this.state.currentUser.emails[0].address}</span>
    } 
  }
  renderMoments() {
    return this.state.moments.map( (moment) => {
      return <p key={moment._id}>{moment.content} - {moment.createdBy}}</p>
    })
  }
  renderUsers() {
    return this.state.users.map( (u) => {
      console.log(u);
      return (
        <p key={u._id}>
          <span>{u._id}</span>
          <button onClick={() => {Meteor.call('handleFollowing', u._id)}} >following</button>
        </p>
      )
    })
  }
  render() {
    return (
      <div>
        <h1>App Component</h1> 
        <p>{ this.renderUser() }</p>
        {/*<p>Current User: {this.renderUserEmail()}</p>*/}
        <button onClick={this.onLogout.bind(this)}>Logout</button>
        <div>
          {this.renderMoments()}
        </div>
        <div>
          {this.renderUsers()}
        </div>
        <div>
          { this.state.error ? <p>{this.state.error}</p> : undefined }
          <form onSubmit={this.addMsg.bind(this)} >
            <input type="text" ref="content" placeholder="Content" />
            <button type="submit">Add Message</button>
          </form>
        </div>
      </div>
    );
  };
}


