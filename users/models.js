'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose'); 
var validate = require('mongoose-validator');

mongoose.Promise = global.Promise;

var usernameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 20],
    message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters',
  }),
  validate({
    validator: 'isAlphanumeric',
    message: 'Username should contain alpha-numeric characters only',
  }),
];

var emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'Please enter valid e-mail',
    passIfEmpty: true
  })
];


const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: usernameValidator
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
    validate: emailValidator
  }},
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
