//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var User = require('../app/models/user');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

//test token
var access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7Il9fdiI6ImluaXQiLCJhZG1pbiI6ImluaXQiLCJwYXNzd29yZCI6ImluaXQiLCJuYW1lIjoiaW5pdCIsIl9pZCI6ImluaXQifSwic3RhdGVzIjp7Imlnbm9yZSI6e30sImRlZmF1bHQiOnt9LCJpbml0Ijp7Il9fdiI6dHJ1ZSwiYWRtaW4iOnRydWUsInBhc3N3b3JkIjp0cnVlLCJuYW1lIjp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJlbWl0dGVyIjp7ImRvbWFpbiI6bnVsbCwiX2V2ZW50cyI6e30sIl9ldmVudHNDb3VudCI6MCwiX21heExpc3RlbmVycyI6MH19LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsiX192IjowLCJhZG1pbiI6dHJ1ZSwicGFzc3dvcmQiOiJwYXNzd29yZCIsIm5hbWUiOiJOaWNrIENlcm1pbmFyYSIsIl9pZCI6IjU3YjJiNTg3ZDU1MGY1ZjI2ODU0ZTJiMCJ9LCJfcHJlcyI6eyIkX19vcmlnaW5hbF9zYXZlIjpbbnVsbCxudWxsXSwiJF9fb3JpZ2luYWxfdmFsaWRhdGUiOltudWxsXSwiJF9fb3JpZ2luYWxfcmVtb3ZlIjpbbnVsbF19LCJfcG9zdHMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W10sIiRfX29yaWdpbmFsX3ZhbGlkYXRlIjpbXSwiJF9fb3JpZ2luYWxfcmVtb3ZlIjpbXX0sImlhdCI6MTQ3MTMzOTAwNH0.wB1o0CotR2vTdohtrrYX3coIM7XdTozQ2b8Ou6gLSFo';
chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
           done();
        });
    });

  /*
  * Test the /GET all route
  */
  describe('/GET users', () => {
      it('it should GET all the users', (done) => {
        chai.request(server)
            .get('/api/users')
            .set('x-access-token',access_token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  /*
  * Test the /POST route for
  */
  describe('/POST book', () => {
      it('it should not POST a user without name field', (done) => {
        var user = {
            password: "007",
            admin: true
        }
            chai.request(server)
            .post('/api/user')
            .set('x-access-token',access_token)
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('message').eql('Insufficient/Incorrect resources; name, password and admin is required.');
              done();
            });
      });
      it('it should not POST a user without password field', (done) => {
        var user = {
          name: "Bond James",
            admin: true
        }
            chai.request(server)
            .post('/api/user')
            .set('x-access-token',access_token)
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('message').eql('Insufficient/Incorrect resources; name, password and admin is required.');
              done();
            });
      });
      it('it should not POST a user without an admin field', (done) => {
        var user = {
          name: "Bond James",
            password: "007",
        }
            chai.request(server)
            .post('/api/user')
            .set('x-access-token',access_token)
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('message').eql('Insufficient/Incorrect resources; name, password and admin is required.');
              done();
            });
      });
      it('it should POST a user ', (done) => {
        var user = {
            name: "Bond James",
            password: "007",
            admin: true
        }
            chai.request(server)
            .post('/api/user')
            .set('x-access-token',access_token)
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('New user successfully added!');
                res.body.should.have.property('success').eql(true);
                res.body.newUser.should.have.property('name');
                res.body.newUser.should.have.property('password');
                res.body.newUser.should.have.property('admin');
              done();
            });
      });
  });

});
