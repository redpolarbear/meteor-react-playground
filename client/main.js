import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Router, Route, browserHistory } from 'react-router';

import App from '../imports/ui/App';
import Login from '../imports/ui/Login';
import Signup from '../imports/ui/Signup';
import NotFound from '../imports/ui/NotFound';

const unauthenticatedPages = ['/signup', '/'];
const authenticatedPages = ['/app'];

/*const NavLinks = () => {
  return (
  <nav>
    <Link to='/'>Home</Link>
    <Link to='/app'>App</Link>
    <Link to='/login'>Login</Link>
    <Link to='/signup'>Signup</Link>
  </nav>
  );
};*/
/*const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={ (props) => (
      !!Meteor.userId()
      ? ( <Component {...props}/> )
      : ( <Redirect to={ {pathname: '/login' }}/> )
    )}/>
  );
};*/
/*const PublicRoute = ( {component: Component, ...rest }) => {
  return (
    <Route {...rest} render={ (props) => (
      !!Meteor.userId()
      ? ( <Redirect to={ {pathname: '/app' }}/> )
      : ( <Component {...props}/> )
    )}/>
  );
};*/
const onEnterPublicPage = () => {
  if (Meteor.userId()) {
    browserHistory.replace('/app');
  }
};
const onEnterPrivatePage = () => {
  if (!Meteor.userId()) {
    browserHistory.replace('/');
  }
};
Tracker.autorun( () => {
  const isAuthenticated = !!Meteor.userId();
  const pathname = browserHistory.getCurrentLocation().pathname;
  const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
  const isAuthenticatedPage = authenticatedPages.includes(pathname); 

  if (isAuthenticated && isUnauthenticatedPage) {
    browserHistory.replace('/app');
  } else if (!isAuthenticated && isAuthenticatedPage) {
    browserHistory.replace('/');
  }
});
const routes = (
  <Router history={browserHistory} >
    <Route exact path = "/" component={Login} onEnter={onEnterPublicPage}/>
    <Route path="/signup" component={Signup} onEnter={onEnterPublicPage} />
    <Route path="/app" component={App} onEnter={onEnterPrivatePage} />
    <Route path="*" component={NotFound} />  
  </Router>
);
Meteor.startup(() => {
  ReactDOM.render(routes, document.getElementById('app'));
})