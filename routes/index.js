var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var userCollection = db.get('users');
var bcrypt = require('bcryptjs');
var userValidation = require('../lib/user-validation');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/glazes', function(req, res, next) {
  res.render('glazes');
});

router.post('/signup', function(req, res, next) {
  var username = req.body.username.trim();
  var email = req.body.signup_email.toLowerCase().trim();
  var password = req.body.signup_password.trim();
  var confirm = req.body.signup_confirm.trim();
  var hash = bcrypt.hashSync(password, 8);

  userValidation.existingUser(email, function(duplicateError) {
    var validate = userValidation.signupValidation(username, email, password, confirm, duplicateError);
    if(validate.length != 0) {
      res.render('index', { signupError: validate, username: username, email: email });
    } else {
        userCollection.insert({
          username: username,
          email: email,
          password: hash
        });
        res.redirect('/glazes');
    };
  });
});

router.post('/login', function(req, res, next) {
  var email = req.body.login_email.toLowerCase().trim();
  var password = req.body.login_password.trim();

  userValidation.loginUser(email, password, function(openSesame, user) {
    console.log(user);
    var validate = userValidation.loginValidation(email, password, openSesame);
    if(validate.length != 0) {
      res.render('index', { loginError: validate, email: email });
    } else if (validate.length === 0) {
      // res.cookie('currentUser', user);
      // res.render('glazes', { currentUser: user});
      res.redirect('/glazes');
    };
  });
});


//Can't set headers after they are sent?
// router.post('/logout', function(req, res, next) {
//   res.clearCookie('currentUser');
//   res.redirect('/index');
// });

// router.post('/add-new', function(req, res, next) {
//   res.render('glazes', { addNewContent: ??????? });
// });











module.exports = router;
