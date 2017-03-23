import React from 'react';
import { Link } from 'react-router';
import { Accounts } from 'meteor/accounts-base';
import md5 from 'md5';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }
  handleSubmit(e) {
    e.preventDefault();

    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();
    let profile = {
      photoURL: `https://www.gravatar.com/avatar/${md5(email.toLowerCase())}?default=mm&s=256`
    }
    Accounts.createUser({email, password, profile}, (err) => {
      console.log('Signup Callback', err);
    })
  }
  render() {
    return (
      <div>
        <h1>Signup</h1>

        { this.state.error ? <p>{this.state.error}</p> : undefined }
        
        <form onSubmit={this.handleSubmit.bind(this)} noValidate>
          <input type="email" ref="email" placeholder="Email" />
          <input type="password" ref="password" placeholder="Password" />
          <button type="submit">Create User</button>
        </form>
        <Link to='/login'>Already have an account?</Link>
      </div>
    );
  };
};