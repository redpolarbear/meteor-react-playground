import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { Moments } from '../imports/models/moments';
import { Followings } from '../imports/models/followings';
import { Followers } from '../imports/models/followers';

if (Meteor.isServer) {
  Meteor.publish('users', function() {
    if (this.userId) {
      return Meteor.users.find({_id: {$ne: this.userId}});
    } else {
      this.ready();
    }
  })

  Meteor.publish('moments', function() {
    if (this.userId) {
      const followings = Followings.findOne({masterId: this.userId});
      // console.log(followings);
      if (followings) {
        return Moments.find({$or: [ {createdBy: {$in: followings.following}}, {createdBy: this.userId}]});
      } else {
        return Moments.find({$or: [{createdBy: this.userId}]});
      }
    } else {
      this.ready();
    }
  })

  Meteor.publish('users.findById', function(uid) {
    return Meteor.users.find({_id: uid}, {fields: {emails: 1}});
  })
  Meteor.publish('user.followings', function() {
    return Followings.find({masterId: this.userId});
  })

  Meteor.publish('user.followingUsers', function() {
    return Followings.find({masterId: this.userId});
  })

  // let tempObj = Followings.find({masterId: this.userId}, {
  //   transform: function(doc) {
  //     doc.followingsObj = Meteor.users.find({_id: {$in: doc.following}});
  //     return doc;
  //   }
  // }).fetch();
  // console.log(tempObj);

}

Meteor.methods({
  'getHttp': function() {
    try {
      let res = HTTP.get('https://jsonplaceholder.typicode.com/posts/10');
      return res.data;
    } catch (e) {
      throw new Meteor.Error('http error');
    }
  },
  'moments.insert': function(content) {
    Moments.insert({
      content: content,
      createdBy: this.userId
    })
  },
  'handleFollowing': function(uid) {
    Followings.upsert(
      { masterId: this.userId },
      { $push: {following: uid} }
    );
  }
})

Meteor.startup(() => {
  // code to run on server at startup
});
