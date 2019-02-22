'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const userRouter = express.Router();
const jsonParser = bodyParser.json();

const {User} = require('./models');



// Post to register a new user
userRouter.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password', 'email'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'email'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ['password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  let {username, password, email} = req.body;
  
  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.find({email})
        .count()
        .then(count => {
          if (count > 0) {
            // There is an existing user with the same username
            return Promise.reject({
              code: 422,
              reason: 'ValidationError',
              message: 'Email already taken',
              location: 'email'});
          }
          // If there is no existing user, hash the password
          return User.hashPassword(password);
        })
        .then(hash => {
          return User.create({
            username,
            password: hash,
            email
          });
        })
        .then(user => {
          return res.status(201).json(user.serialize());
        })
        .catch(err => {
          console.log(err);
          // Forward validation errors on to the client, otherwise give a 500
          // error because something unexpected has happened
          if (err.name === 'ValidationError') {
            res.status(412).json(err);
          }
          res.status(500).json({code: 500, message: 'Internal server error'});
        });
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

module.exports = userRouter;