var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var userCollection = db.get('users');
var bcrypt = require('bcryptjs');
var userValidation = require('../lib/user-validation');

router.get('/', function(req, res, next) {
  res.render('index');
});

  // put an if statement that will only allow "logged in" users to visit this page
router.get('/glazes', function(req, res, next) {
  if(req.cookies.currentUser) {
    var userCookie = req.cookies.currentUser;
    res.render('glazes', { currentUser: userCookie });
  } else {
    res.redirect('/glazes');
  }
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
          password: hash,
          glazeRecipes: []
        });
        res.cookie('currentUser', username )
        res.redirect('/glazes');
    };
  });
});

// router.post('/login', function(req, res, next) {
//   var email = req.body.login_email.toLowerCase().trim();
//   var password = req.body.login_password.trim();
//
//   userValidation.loginUser(email, password, function(openSesame, user) {
//     var validate = userValidation.loginValidation(email, password, openSesame);
//     if(validate.length != 0) {
//       res.render('index', { loginError: validate, email: email });
//     } else if (validate.length === 0) {
//       // res.cookie('currentUser', user);
//       // res.render('glazes', { currentUser: user});
//       res.redirect('/glazes');
//     };
//   });
// });

router.post('/login', function(req, res, next) {
  var email = req.body.login_email.toLowerCase().trim();
  var password = req.body.login_password.trim();
  // var validate = userValidation.loginValidation(email, password);

  userCollection.findOne({ email: email }, function(err, user) {
    if(!user) {
      res.render('index', { loginError: 'No account associated with this email, please create an account.', email: email })
    } else if(user) {
      var compare = bcrypt.compareSync(password, user.password);
      if(compare) {
        res.cookie('currentUser', user.username);
        res.redirect('/glazes');
      } else {
        res.render('index', { loginError: 'Invalid password.' })
      };
    };
  });
});


//Can't set headers after they are sent?
router.post('/logout', function(req, res, next) {
  res.clearCookie('currentUser');
  res.redirect('/');
});

// router.post('/add-new', function(req, res, next) {
//   res.render('glazes', { addNewContent: ??????? });
// });











module.exports = router;
