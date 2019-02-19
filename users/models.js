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
      validator.isAlphanumeric(username); },
    message: 'Username can only contain letters and numbers'
    }
  },
  password: {
    type: String,
    required: true
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
});


UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    email: this.email || '',
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
