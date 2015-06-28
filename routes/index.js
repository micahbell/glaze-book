var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/glaze-book');
var userCollection = db.get('users');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/glazes', function (req, res, next) {
  res.render('glazes');
});

router.post('/signup', function (req, res, next) {
  if(req.body.signup_password !== req.body.signup_confirm) {
    res.render('index', { signupError: 'Passwords do not match.'});
  } else {
    var hash = bcrypt.hashSync(req.body.signup_password, 8);
    userCollection.insert({
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      email: req.body.signup_email,
      password: hash
    });
    res.redirect('/glazes');
  };
});

router.post('/login', function (req, res, next) {
  userCollection.findOne({ email: req.body.login_email }, function (err, user) {
    if(user) {
      var compare = bcrypt.compareSync(req.body.login_password, user.password);
      if(compare === false) {
        res.render('index', { loginError: 'Invalid login or password.'});
      } else {
        res.redirect('/glazes');
      };
    } else {
      res.render('index', { loginError: 'Invalid login or password.'});
    };
  });
});




module.exports = router;
