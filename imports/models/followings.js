import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Followings = new Mongo.Collection('followings', {
  transform: function(doc) {
    doc.followingUsers = Meteor.users.find({
      _id: { $in: doc.following}
    }, {
      fields: { emails: 1 }
    }).fetch();
    return doc;
  }
});