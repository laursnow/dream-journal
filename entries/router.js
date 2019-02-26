'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { Entry } = require('./models');
const entriesRouter = express.Router();
const app = express();
const passport = require('passport');
const {User} = require('../users/models');
entriesRouter.use(morgan('common'));
entriesRouter.use(express.json());
const userRouter = require('../users/router');
app.use('/users', userRouter);

const {localStrategy, jwtStrategy } = require('../auth');
passport.use(localStrategy);
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', {session: false});
app.use(jwtAuth);

// Entry => ({
//   create: async ctx => {
//     ctx.body = await Entry.create(ctx.request.body)
//   },

//   all: async ctx => {
//     ctx.body = await Entry.find({})
//       .populate('users')
//   }
// })

entriesRouter.get('/', (req, res) => {
  Entry
    .find()
    .then(entries => {
      res.json(entries.map(entries => entries.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

entriesRouter.get('/:id', (req, res) => {
  console.log(req.user);
  Entry
    .findById(req.params.id)
    .then(entry => res.json(entry.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});



entriesRouter.post('/', jwtAuth, (req, res) => {
  const requiredFields = ['title', 'content'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Entry
    .create({
      title: req.body.title,
      content: req.body.content,
      contentDate: req.body.contentDate,
      postDate: req.body.postDate,
      tags: req.body.tags,
    })
    .then(entry => res.status(201).json(entry.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
  User
    .find({username: req.user.username})
    .then(result => { return result[0]._id; })
    .then(id => {
      return Entry.findOneAndUpdate({title: req.body.title}, {user: id});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

entriesRouter.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['title', 'content', 'contentDate', 'postDate', 'tags'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Entry
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(entry => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


entriesRouter.delete('/:id', (req, res) => {
  Entry
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted entry with id \`${req.params.id}\``);
      res.status(204).end();
    });
});


entriesRouter.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = entriesRouter;