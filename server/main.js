import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { Moments } from '../imports/models/moments';
import { Followings } from '../imports/models/followings';
import { Followers } from '../imports/models/followers';


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
