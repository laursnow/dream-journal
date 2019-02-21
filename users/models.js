//complete

'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose'); 
const validator = require('validator');

mongoose.Promise = global.Promise;


const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: { function(username) {
      validator.isAlphanumeric(username).isLength(username, {min: 3}); },
    message: 'Username can only contain letters and numbers and must be a minimum of 3 characters long'
    }
  },
  password: {
    type: String,
    required: true,
    validate: { function(password) {
      validator.isLength(password, {min: 8, max: 72});
    },
    message: 'Password must be 8-72 characters long'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: { function(email) {
      validator.isEmail(email); 
    },
    message: 'Please enter valid e-mail',
    }
  }
},
{ collection: 'users'});


UserSchema.methods.serialize = function() {
  return {
    username: this.username,
    email: this.email
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
