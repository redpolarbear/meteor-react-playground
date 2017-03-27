import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import { Link } from 'react-router';
import { HTTP } from 'meteor/http';

import { Moments } from '../models/moments';
import { Followings } from '../models/followings';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      content: '',
      error: '',
      followings: [],
      followingUsers: [],
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

      Meteor.subscribe('moments');
      const moments = Moments.find({}).fetch();
      this.setState({ moments });

      Meteor.subscribe('users');
      Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch() ? this.setState({users: Meteor.users.find({ _id: { $ne: Meteor.userId() }}).fetch()}) : undefined;

      Meteor.subscribe('user.followings')
      let followings = Followings.findOne({ masterId: Meteor.userId() });
      if (followings) {
        // console.log(followings[0]);
        this.setState({
          followings: followings.following,
          followingUsers: followings.followingUsers
        });
        // console.log(followings[0].following.includes('gPxRK9H4Jj2tCjKA6'));
        // console.log(this.state.followings);
      }

      // Meteor.subscribe('user.followingUsers', [], () => {
      //   let followingUsers = Followings.findOne({ masterId: Meteor.userId() });
      //   console.log(followingUsers);
      //   if (followingUsers) {
      //     console.log('no followings');
      //   } else {
      //     console.log(followingUsers);
      //   }
      // });

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
      return (
        <div>
          <img style={{width: '64px', height: '64px'}} src={this.state.currentUser.profile.photoURL} />
          <p>{this.state.currentUser.emails[0].address}</p>
        </div>
      )
    } 
  }
  renderUserEmail(createdById) {
    Meteor.subscribe('users.findById', createdById);
    const createdBy = Meteor.users.findOne({ _id: createdById}, {fields: {emails: 1}});
    // console.log(createdBy);
    if (createdBy) {
      return createdBy.emails[0].address;
    } else {
      return;
    }
  }
  renderMoments() {
    return this.state.moments.map( (moment) => {
      // console.log(moment);
      return <p key={ moment._id }>{ moment.content } - { moment.createdByUserObj.emails[0].address }</p>
    })
  }
  doFollowing(uid) {
    Meteor.call('handleFollowing', uid);
  }
  renderUsers() {
    return this.state.users.map( (u) => {
      return (
        <p key={ u._id }>
          <span>{ u.emails[0].address } - {u._id} </span>
          <button onClick={ this.doFollowing.bind(this, u._id) }>
            { this.state.followings.includes(u._id) ? 'followed' : 'following' }
          </button>
        </p>
      )
    })
  }
  renderFollowingUsers() {
    return this.state.followingUsers.map( (fU) => {
      return (
        <ul key={fU._id}>
          <li>{ fU.emails[0].address }</li>
        </ul>
      )
    })
  }
  render() {
    return (
      <div>
        <h1>App Component</h1> 
        <div>{ this.renderUser() }</div>
        <p>Following: </p>
        { this.renderFollowingUsers() }
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


