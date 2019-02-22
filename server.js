'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const app = express();
app.use(morgan('common'));

const jwtAuth = passport.authenticate('jwt', {session: false});
app.use(jwtAuth);

const entriesRouter = require('./entries/router');
app.use('/entries', entriesRouter);
const userRouter = require('./users/router');
app.use('/users', userRouter);
const authRouter = require('./auth/router');
app.use('/auth', authRouter);
mongoose.Promise = global.Promise;
const {localStrategy, jwtStrategy } = require('./auth');

const { PORT, DATABASE_URL } = require('./config');

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

let server;

function runServer(DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        console.log(`database ${DATABASE_URL}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };
