'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { Entry } = require('../entries/models');
const { User } = require('../users/models');
const { JWT_SECRET } = require('../config');
const { JWT_EXPIRY } = require('../config');
const jwt = require('jsonwebtoken');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  ata from one test does not stick
// around for next one
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

let testUser;

// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedEntryData() {
  console.log('seeding blog post data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      contentDate: faker.date(),
      postDate: faker.date(),
      tags: faker.random.words(), 
      user: testUser,
    }, {collection: 'entries'}
    );}
  return Entry.insertMany(seedData);
}

function seedDummyUser() {
  console.log('seeding dummy user');
  const seedUser = [{
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email()}, {collection: 'users'}];
  return User.save(seedUser);
}

describe('dream journal API resource', function () {



  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach( function(){
    return seedDummyUser()
      .then( user => {
        testUser = user;
      });
  });

  beforeEach(function () {
    return seedEntryData();
  });

  afterEach(function () {
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  describe('register new user endpoint'), function () {

    it('should register user',
      function (done) {

        const userCredentials = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email()};

        return chai.request(app)
          .post('../users')
          .send(userCredentials)
          .then(function (res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys(
              'id', 'username', 'password', 'email');
            res.body.username.should.equal(userCredentials.username);
            res.body.email.should.equal(userCredentials.email);
            // cause Mongo should have created id on insertion
            return User.findById(res.body.id);
          })
          .then(function (user) {
            user.username.should.equal(userCredentials.username);
            user.body.email.should.equal(userCredentials.email);
            done();
          }); 
      });

    describe('login endpoint'), function () {

      it('should login user and return authentification token',


        function (done) {
 
          return chai.request(app)
            .post('../auth/login')
            .send(testUser.username, testUser.password)
            .then (function (res) {
              res.should.have.status(200);
              res.shoud.be.json;
              res.should.be.a('object');
              done();
            });
        });};
  };

  describe('GET endpoint', function () {

    it('should return all existing posts by logged in user', function (done) {
  
      const token = jwt.sign({
        id: testUser._id
      }, JWT_SECRET, { expiresIn: JWT_EXPIRY }); 

      let res;
      return chai.request(app)
        .get('../entries')
        .set( 'Authorization', `Bearer ${ token }` )
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          // otherwise our db seeding didn't work
          res.body.should.have.lengthOf.at.least(1);
          return Entry.count();
        })
        .then(count => {
          // the number of returned posts should be same
          // as number of posts in DB
          res.body.should.have.lengthOf(count);
          done();
        });
    });

    it('should return posts with right fields', function (done) {
      // Strategy: Get back all posts, and ensure they have expected keys
      const token = jwt.sign({
        id: testUser._id
      }, JWT_SECRET, { expiresIn: JWT_EXPIRY }); 

      let resEntry;
      return chai.request(app)
        .get('../entries')
        .set( 'Authorization', `Bearer ${ token }` )
        .then(function (res) {

          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.lengthOf.at.least(1);

          res.body.forEach(function (entry) {
            entry.should.be.a('object');
            entry.should.include.keys('id', 'title', 'content', 'contentDate', 'postDate', 'tags');
          });
          // just check one of the posts that its values match with those in db
          // and we'll assume it's true for rest
          resEntry = res.body[0];
          return Entry.findById(resEntry.id);
        })
        .then(entry => {
          resEntry.title.should.equal(entry.title);
          resEntry.content.should.equal(entry.content);
          resEntry.contentDate.should.equal(entry.contentDate);
          resEntry.postDate.should.equal(entry.postDate);
          resEntry.tags.should.equal(entry.tags);
          done();
        });
    });
  });



  describe('POST endpoint', function () {
    // strategy: make a POST request with data,
    // then prove that the post we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new entry', function (done) {

      const token = jwt.sign({
        id: testUser._id
      }, JWT_SECRET, { expiresIn: JWT_EXPIRY }); 
      
      const newEntry = {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        contentDate: faker.date(),
        postDate: faker.date(),
        tags: faker.random.words(), 
        user: testUser
      };

      return chai.request(app)
        .post('../entries')
        .set( 'Authorization', `Bearer ${ token }` )
        .send(newEntry)
        .then(function (res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'title', 'content', 'contentDate', 'postDate', 'tags');
          res.body.title.should.equal(newEntry.title);
          // cause Mongo should have created id on insertion
          res.body.id.should.not.be.null;
          res.body.content.should.equal(newEntry.content);
          return Entry.findById(res.body.id);
        })
        .then(function (entry) {
          entry.title.should.equal(newEntry.content);
          entry.contentDate.should.equal(newEntry.contentDate);
          entry.postDate.should.equal(newEntry.postDate);
          entry.tags.should.equal(newEntry.tags);
          done();
        });
    });
  });

  
  describe('PUT endpoint', function () {
    
    const token = jwt.sign({
      id: testUser._id
    }, JWT_SECRET, { expiresIn: JWT_EXPIRY }); 
    
    // strategy:
    //  1. Get an existing post from db
    //  2. Make a PUT request to update that post
    //  4. Prove post in db is correctly updated
    it('should update fields you send over', function () {
      const updateData = {
        title: 'I won the lottery',
        content: 'I had a dream I won the lottery',
        contentDate: Date.now(),
        postDate: '2/20/2019',
        tags: 'winning, good dream', 
        user: testUser
      };

      return Entry
        .set( 'Authorization', `Bearer ${ token }` )
        .findOne()
        .then(post => {
          updateData.id = post.id;

          return chai.request(app)
            .set( 'Authorization', `Bearer ${ token }` )
            .put(`../entries${post.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return Entry.findById(updateData.id);
        })
        .then(entry => {
          entry.title.should.equal(updateData.title);
          entry.content.should.equal(updateData.content);
          entry.contentDate.should.equal(updateData.contentDate);
          entry.postDate.should.equal(updateData.postDate);
          entry.tags.should.equal(updateData.tags);

        });
    });
  });

  describe('DELETE endpoint', function () {
    // strategy:
    //  1. get a post
    //  2. make a DELETE request for that post's id
    //  3. assert that response has right status code
    //  4. prove that post with the id doesn't exist in db anymore
    it('should delete a post by id', function () {

      const token = jwt.sign({
        id: testUser._id
      }, JWT_SECRET, { expiresIn: JWT_EXPIRY }); 

      let entry;

      return Entry
        .set( 'Authorization', `Bearer ${ token }` )
        .findOne()
        .then(_entry => {
          entry = _entry;
          return chai.request(app).delete(`/entires/${entry.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return Entry.findById(entry.id);
        })
        .then(_entry => {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_post.should.be.null` would raise
          // an error. `should.be.null(_post)` is how we can
          // make assertions about a null value.
          should.not.exist(_entry);
        });
    });
  });
});