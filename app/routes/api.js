//
//PACKAGES
//
var express = require('express');
var User   = require('../models/user'); // get our mongoose model
var mongoose    = require('mongoose');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('config'); // get our config file

//
//CONFIGURATION
//

mongoose.connect(config.database); // connect to database
//
// API ROUTES -------------------
//
var apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
  console.log(`req.body.name ${req.body.name}`);
  console.log(`User: ${JSON.stringify(User)}`);
  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var userIdentity = {"name": user.name};
        var token = jwt.sign(userIdentity, config.secret, {
          //expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

    }

  });
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});


// route to show a random message (GET /api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET /api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

// route to add a new user (POST /api/user)
apiRoutes.post('/user', function(req, res) {
  //Fetch values from req.body
  var username = req.body.name;
  var password = req.body.password;
  var isAdmin = req.body.admin;

  if(!username || !password || !isAdmin){
    res.send({success: false, message: 'Insufficient/Incorrect resources; name, password and admin is required.'})
  }else{
    //Create  new user
    var newUser = new User({name: username, password: password, admin: isAdmin});
    //Save it to DB
    newUser.save(function(err){
      if(err)
        res.send(err);
      else {
        res.json({
          success: true,
          message : 'New user successfully added!',
          newUser
        })
      }
    })
  }
})

//route to return a particular user by id (GET /api/user/:id)
apiRoutes.get('/user/:id', function(req,res){
  User.findById(req.params.id, function(err, user){
        if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(user);
    });
})

// route to delete a particular user by id (DELETE /api/user/:id)
apiRoutes.delete('/user/:id',function(req,res){
  User.remove({_id : req.params.id}, function(err, result){
      if(err) res.send(err);
      res.json({ message: "User successfully deleted!", result });
    });
})

// route to update a particular user by id (PUT /api/user/:id )
apiRoutes.put('/user/:id', function(req,res){
  User.findById({_id: req.params.id}, function(err, user){
       if(err) res.send(err);
       Object.assign(user, req.body).save(function(err, user){
           if(err) res.send(err);
           res.json({ message: 'user updated!', user });
       });
   });
})

module.exports = apiRoutes;
