var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var userCollection = db.get('users');
var bcrypt = require('bcryptjs');
var userValidation = require('../lib/user-validation');
var database = require('../lib/database');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/glazes', function(req, res, next) {
  if(req.cookies.currentUser) {
    var userCookie = req.cookies.currentUser;
    res.render('glazes', { currentUser: userCookie });
  } else {
    res.redirect('/');
  };
});

router.get('/glazes/show-all', function(req, res, next) {
  if(req.cookies.currentUser) {
    var userCookie = req.cookies.currentUser;
    var emailCookie = req.cookies.userEmail;
    userCollection.findOne({ email: emailCookie }, function(err, record) {
      if(!record) {
        res.redirect('/glazes');
      } else {
        // console.log(record);
        res.render('glazes', { currentUser: userCookie, recipe: record.glazeRecipes });
      };
    });
  } else {
      res.redirect('/');
  };
});
//find record based on email
//pull out glaze Recipes array
//pass in array and id
// function pulls obj based on id and returns it
//pass object into render

router.get('/glazes/:id', function(req, res, next) {
  var emailCookie = req.cookies.userEmail;
  var recipeID = req.params.id;
  userCollection.findOne({ email: emailCookie }, function(err, oneRecipe) {
    console.log(oneRecipe.glazeRecipes);
    var recipesArray = oneRecipe.glazeRecipes;
    database.recipeFinder(recipeID, recipesArray);

  });
  res.render('/glazes', { oneRecipe: oneRecipe });
});

// router.get('/glazes/:id', function(req, res, next) {
//   var emailCookie = req.cookies.userEmail;
//   // var recipe = userCollection.id(req.params.id);
//   // console.log('*****************',recipe);
//   // userCollection.findOne({ email: emailCookie }, function(err, rec) {
//     var id = req.params.id;
//
//   // userCollection.find({ email: emailCookie }, function(err, rec) {
//   // userCollection.findOne( { 'glazeRecipes._id': req.params.id } , function(err, rec) {
//   userCollection.find({ 'email': emailCookie }, { 'glazeRecipes': { $elemMatch: { '_id': id }}}, function(err, rec) {
//     console.log(rec);
//     console.log(rec[0].glazeRecipes[0]._id);
//     res.render('glazes', { rec: rec });
//   });
// });

// db.inventory.find( { type: 'food', price: { $lt: 9.95 } } )
// db.users.find( { name: "John"}, { items: { $elemMatch: { item_id: "1234" } } })
// b.users.find({awards: {$elemMatch: {award:'National Medal', year:1975}}})
// db.products.find( { qty: { $gt: 25 } } )

// Signup ====================

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
        res.cookie('currentUser', username );
        res.cookie('userEmail', email );
        console.log(email);
        res.redirect('/glazes');
    };
  });
});

// Login and Logout ====================

router.post('/login', function(req, res, next) {
  var email = req.body.login_email.toLowerCase().trim();
  var password = req.body.login_password.trim();
  userCollection.findOne({ email: email }, function(err, user) {
    if(!user) {
      res.render('index', { loginError: 'No account associated with this email, please create an account.', email: email })
    } else if(user) {
      var compare = bcrypt.compareSync(password, user.password);
      if(compare) {
        res.cookie('currentUser', user.username);
        res.cookie('userEmail', user.email);
        res.redirect('/glazes');
      } else {
        res.render('index', { loginError: 'Invalid password.', email: email })
      };
    };
  });
});

router.post('/logout', function(req, res, next) {
  res.clearCookie('currentUser');
  res.clearCookie('userEmail');
  res.redirect('/');
});

// Show All Page ====================

router.post('/show-all', function(req, res, next) {
  var dateString = Date();
  var recipeID = userCollection.id();
  var userCookie = req.cookies.currentUser;
  var emailCookie = req.cookies.userEmail;
  userCollection.update({ email: emailCookie },
    { $push:
      { glazeRecipes: {
        _id: recipeID,
        dateAdded: dateString,
        title: req.body.title,
        favorite: req.body.favorite,
        tempRange: req.body.temp_range,
        cone: req.body.cone,
        firingType: req.body.firing_type,
        surface: req.body.surface,
        opacity: req.body.opacity,
        color: req.body.color,
        specialty: req.body.specialty,
        ingredients: [
          req.body.ingredient_1,
          req.body.ingredient_2,
          req.body.ingredient_3,
          req.body.ingredient_4,
          req.body.ingredient_5,
          req.body.ingredient_6,
          req.body.ingredient_7,
          req.body.ingredient_8,
          req.body.ingredient_9,
          req.body.ingredient_10
        ],
        amounts: [
          req.body.amount_1,
          req.body.amount_2,
          req.body.amount_3,
          req.body.amount_4,
          req.body.amount_5,
          req.body.amount_6,
          req.body.amount_7,
          req.body.amount_8,
          req.body.amount_9,
          req.body.amount_10
        ],
        addIns: [
          req.body.add_in_1,
          req.body.add_in_2,
          req.body.add_in_3,
          req.body.add_in_4,
          req.body.add_in_5,
          req.body.add_in_6
        ],
        addAmounts: [
          req.body.add_amount_1,
          req.body.add_amount_2,
          req.body.add_amount_3,
          req.body.add_amount_4,
          req.body.add_amount_5,
          req.body.add_amount_6
        ],
        tested: req.body.tested,
        notes: req.body.notes,
        image: req.body.image
      }
    }
  });
  res.redirect('/glazes/show-all');
});




module.exports = router;
