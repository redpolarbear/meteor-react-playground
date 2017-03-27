import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Moments = new Mongo.Collection('moments', {
  transform: function(doc) {
      doc.createdByUserObj = Meteor.users.findOne({
          _id: doc.createdBy
      });
      return doc;
  }
});