import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

Meteor.startup(() => {
  // code to run on server at startup
  // try {
    HTTP.call('GET', 'https://jsonplaceholder.typicode.com/pos', {},
      function(error, response) {
        if (error) {
          throw new Meteor.Error(400, e.message);
        } else {
          console.log('response', response);
        }
      }
    );  
  // } catch(e) {
  //   throw new Error('http error');
  // }
  
});
