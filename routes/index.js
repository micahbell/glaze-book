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
        res.render('glazes', { currentUser: userCookie, recipe: record.glazeRecipes });
      };
    });
  } else {
      res.redirect('/');
  };
});

router.get('/glazes/:id', function(req, res, next) {
  if(req.cookies.currentUser) {
    var userCookie = req.cookies.currentUser;
    var emailCookie = req.cookies.userEmail;
    userCollection.findOne({ email: emailCookie }, function(err, oneRecipe) {
      var recipeID = req.params.id;
      var recipeArray = oneRecipe.glazeRecipes;
      var recipe = database.recipeFinder(recipeID, recipeArray);
      var ingredients = recipe.ingredients;
      var amounts = recipe.amounts;
      var addIngredients = recipe.addIns;
      var addAmounts = recipe.addAmounts;
      if(oneRecipe) {
        res.render('glazes', { oneRecipe: recipe, ingredients: ingredients, amounts: amounts, addIngredients: addIngredients, addAmounts: addAmounts, currentUser: userCookie });
      };
    });
  } else {
      res.redirect('/');
  };
});

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
  var date = Date();
  var recipeID = userCollection.id();
  var userCookie = req.cookies.currentUser;
  var emailCookie = req.cookies.userEmail;
  userCollection.update({ email: emailCookie },
    { $push:
      { glazeRecipes: {
        _id: recipeID,
        dateAdded: date,
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
