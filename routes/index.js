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
  var userCookie = req.cookies.currentUser;
  res.render('glazes', { currentUser: userCookie });
});

// All Recipes ====================
router.get('/glazes/show-all', function(req, res, next) {
  var userCookie = req.cookies.currentUser;
  var emailCookie = req.cookies.userEmail;
  userCollection.findOne({ email: emailCookie }, function(err, record) {
    if(!record) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', { currentUser: userCookie, recipes: record.glazeRecipes });
    };
  });
});

// Firing Temps ====================
router.get('/glazes/firing-temp', function(req, res, next) {
  var userCookie = req.cookies.currentUser;
  res.render('glazes', { currentUser: userCookie, firingTemp: [
    { range: 'low', title: 'Low Fire' },
    { range: 'mid', title: 'Mid Range' },
    { range: 'high', title: 'High Fire' }]
  });
});

// Low Range ====================
router.get('/glazes/firing-temp/low', function(req, res, next) {
  var userCookie = req.cookies.currentUser;
  var emailCookie = req.cookies.userEmail;
  userCollection.findOne({ email: emailCookie }, function (err, lowRangeRecipes) {
    var recipeArray = lowRangeRecipes.glazeRecipes;
    var lowRecipe = database.lowRangeFinder(recipeArray);
    if(lowRecipe.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', { currentUser: userCookie, lowRecipe: lowRecipe, firingTemp: [
        { range: 'low', title: 'Low Fire' },
        { range: 'mid', title: 'Mid Range' },
        { range: 'high', title: 'High Fire' }]
      });
    };
  });
});

// Mid Range ====================
router.get('/glazes/firing-temp/mid', function(req, res, next) {
  var userCookie = req.cookies.currentUser;
  var emailCookie = req.cookies.userEmail;
  userCollection.findOne({ email: emailCookie }, function (err, midRangeRecipes) {
    var recipeArray = midRangeRecipes.glazeRecipes;
    var midRecipe = database.midRangeFinder(recipeArray);
    if(midRecipe.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', { currentUser: userCookie, midRecipe: midRecipe, firingTemp: [
        { range: 'low', title: 'Low Fire' },
        { range: 'mid', title: 'Mid Range' },
        { range: 'high', title: 'High Fire' }]
      });
    };
  });
});

// High Range ====================
router.get('/glazes/firing-temp/high', function(req, res, next) {
  var userCookie = req.cookies.currentUser;
  var emailCookie = req.cookies.userEmail;
  userCollection.findOne({ email: emailCookie }, function (err, highRangeRecipes) {
    var recipeArray = highRangeRecipes.glazeRecipes;
    var highRecipe = database.highRangeFinder(recipeArray);
    if(highRecipe.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', { currentUser: userCookie, highRecipe: highRecipe, firingTemp: [
        { range: 'low', title: 'Low Fire' },
        { range: 'mid', title: 'Mid Range' },
        { range: 'high', title: 'High Fire' }]
      });
    };
  });
});

// Surface ====================
router.get('/glazes/surface', function(req, res, next) {
  var userCookie = req.cookies.currentUser;
  res.render('glazes', { currentUser: userCookie, surface: [
    { surface: 'shiny', title: 'Shiny or Glossy' },
    { surface: 'semi', title: 'Semi-gloss' },
    { surface: 'satin', title: 'Semi-matte or Satin' },
    { surface: 'matte', title: 'Matte' },
    { surface: 'dry', title: 'Dry Matte' }]
  });
});

// Surface - Shiny ====================
router.get('/glazes/surface/shiny', function(req, res, next) {
  var userCookie = req.cookies.currentUser;
  var emailCookie = req.cookies.userEmail;
  userCollection.findOne({ email: emailCookie }, function(err, shinyRecipes) {
    var recipeArray = shinyRecipes.glazeRecipes;
    var shinyRecipe = database.shinyFinder(recipeArray);
    if(shinyRecipe.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', { currentUser: userCookie, shinyRecipe: shinyRecipe, surface: [
        { surface: 'shiny', title: 'Shiny or Glossy' },
        { surface: 'semi', title: 'Semi-gloss' },
        { surface: 'satin', title: 'Semi-matte or Satin' },
        { surface: 'matte', title: 'Matte' },
        { surface: 'dry', title: 'Dry Matte' }]
      });
    };
  });
});

// Surface - Semi-Gloss ====================
router.get('/glazes/surface/semi', function(req, res, next) {
  var userCookie = req.cookies.currentUser;
  var emailCookie = req.cookies.userEmail;
  userCollection.findOne({ email: emailCookie }, function(err, semiRecipes) {
    var recipeArray = semiRecipes.glazeRecipes;
    var semiRecipe = database.semiFinder(recipeArray);
    if(semiRecipe.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', { currentUser: userCookie, semiRecipe: semiRecipe, surface: [
        { surface: 'shiny', title: 'Shiny or Glossy' },
        { surface: 'semi', title: 'Semi-gloss' },
        { surface: 'satin', title: 'Semi-matte or Satin' },
        { surface: 'matte', title: 'Matte' },
        { surface: 'dry', title: 'Dry Matte' }]
      });
    };
  });
});

// Surface - Satin ====================
router.get('/glazes/surface/satin', function(req, res, next) {
  var userCookie = req.cookies.currentUser;
  var emailCookie = req.cookies.userEmail;
  userCollection.findOne({ email: emailCookie }, function(err, satinRecipes) {
    var recipeArray = satinRecipes.glazeRecipes;
    var satinRecipe = database.satinFinder(recipeArray);
    if(satinRecipe.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', { currentUser: userCookie, satinRecipe: satinRecipe, surface: [
        { surface: 'shiny', title: 'Shiny or Glossy' },
        { surface: 'semi', title: 'Semi-gloss' },
        { surface: 'satin', title: 'Semi-matte or Satin' },
        { surface: 'matte', title: 'Matte' },
        { surface: 'dry', title: 'Dry Matte' }]
      });
    };
  });
});

// Surface - Matte ====================
router.get('/glazes/surface/matte', function(req, res, next) {
  var userCookie = req.cookies.currentUser;
  var emailCookie = req.cookies.userEmail;
  userCollection.findOne({ email: emailCookie }, function(err, matteRecipes) {
    var recipeArray = matteRecipes.glazeRecipes;
    var matteRecipe = database.matteFinder(recipeArray);
    if(matteRecipe.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', { currentUser: userCookie, matteRecipe: matteRecipe, surface: [
        { surface: 'shiny', title: 'Shiny or Glossy' },
        { surface: 'semi', title: 'Semi-gloss' },
        { surface: 'satin', title: 'Semi-matte or Satin' },
        { surface: 'matte', title: 'Matte' },
        { surface: 'dry', title: 'Dry Matte' }]
      });
    };
  });
});

// Surface - Dry ====================
router.get('/glazes/surface/dry', function(req, res, next) {
  var userCookie = req.cookies.currentUser;
  var emailCookie = req.cookies.userEmail;
  userCollection.findOne({ email: emailCookie }, function(err, dryRecipes) {
    var recipeArray = dryRecipes.glazeRecipes;
    var dryRecipe = database.dryFinder(recipeArray);
    if(dryRecipe.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', { currentUser: userCookie, dryRecipe: dryRecipe, surface: [
        { surface: 'shiny', title: 'Shiny or Glossy' },
        { surface: 'semi', title: 'Semi-gloss' },
        { surface: 'satin', title: 'Semi-matte or Satin' },
        { surface: 'matte', title: 'Matte' },
        { surface: 'dry', title: 'Dry Matte' }]
      });
    };
  });
});

// Favorites ====================
router.get('/glazes/favorites', function(req, res, next) {
  var userCookie = req.cookies.currentUser;
  var emailCookie = req.cookies.userEmail;
  userCollection.findOne({ email: emailCookie }, function(err, favRecipe) {
    var recipeArray = favRecipe.glazeRecipes;
    var favRecipe = database.favFinder(recipeArray);
    if(favRecipe.length === 0) {
      res.redirect('/glazes/show-all');
    } else {
    res.render('glazes', { currentUser: userCookie, favRecipe: favRecipe });
    };
  });
});

// Recently Added ====================
router.get('/glazes/recently-added', function(req, res, next) {
  var emailCookie = req.cookies.userEmail;
//   $natural: -1 ?
//   userCollection.findOne({ email: emailCookie }, function(err, recentRecipe) {
//     console.log('++++++++++++++++++++', recentRecipe);
//     var recipeArray = recentRecipe.glazeRecipes;
//     console.log('--------------------', recipeArray);
//   });
});

// Show One ====================
router.get('/glazes/:id', function(req, res, next) {
  var userCookie = req.cookies.currentUser;
  var emailCookie = req.cookies.userEmail;
  userCollection.findOne({ email: emailCookie }, function(err, allRecipes) {
    var recipeID = req.params.id;
    var recipeArray = allRecipes.glazeRecipes;
    var recipe = database.recipeFinder(recipeID, recipeArray);
    var ingredients = recipe.ingredients;
    var amounts = recipe.amounts;
    var addIngredients = recipe.addIns;
    var addAmounts = recipe.addAmounts;
    if(allRecipes) {
      res.render('glazes', {
        oneRecipe: recipe,
        ingredients: ingredients,
        amounts: amounts,
        addIngredients: addIngredients,
        addAmounts: addAmounts,
        currentUser: userCookie
      });
    };
  });
});

// Edit ====================
router.get('/glazes/:id/edit', function(req, res, next) {
  var userCookie = req.cookies.currentUser;
  var emailCookie = req.cookies.userEmail;
  userCollection.findOne({ email: emailCookie }, function(err, editRecipe) {
    var recipeID = req.params.id;
    var recipeArray = editRecipe.glazeRecipes;
    var recipe = database.recipeFinder(recipeID, recipeArray);
    var ingredients = recipe.ingredients;
    var amounts = recipe.amounts;
    var addIngredients = recipe.addIns;
    var addAmounts = recipe.addAmounts;
    if(editRecipe) {
      res.render('glazes', {
        editRecipe: recipe,
        ingredients: ingredients,
        amounts: amounts,
        addIngredients: addIngredients,
        addAmounts: addAmounts,
        currentUser: userCookie
      });
    };
  });
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
    }
  });
});

// Login and Logout ====================
router.post('/login', function(req, res, next) {
  var email = req.body.login_email.toLowerCase().trim();
  var password = req.body.login_password.trim();
  userCollection.findOne({ email: email }, function(err, user) {
    if(!user) {
      res.render('index', { loginError: 'No account associated with this email, please create an account.', email: email });
    } else if(user) {
      var compare = bcrypt.compareSync(password, user.password);  
      if(compare) {
        res.cookie('currentUser', user.username);
        res.cookie('userEmail', user.email);
        res.redirect('/glazes');
      } else {
        res.render('index', { loginError: 'Invalid password.', email: email });
      }
    }
  });
});

router.post('/logout', function(req, res, next) {
  res.clearCookie('currentUser');
  res.clearCookie('userEmail');
  res.redirect('/');
});

// Show All ====================
router.post('/show-all', function(req, res, next) {
  var date = Date();
  var recipeID = userCollection.id();
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
        testStatus: req.body.test_status,
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

// Submit Edit ====================

// router.post('/glazes/:id/edit', function (req, res, next) {
//   var emailCookie = req.cookies.userEmail;
//   userCollection.findOne({ email: emailCookie }, function(err, recipe) {
//     var recipeID = req.params.id;
//     var recipeArray = recipe.glazeRecipes;
//     var recipe = database.recipeFinder(recipeID, recipeArray);
//     var date = recipe.dateAdded;
//     userCollection.update({ email: emailCookie },
//       { $set:
//         { glazeRecipes:
//           { dateAdded: date }
//         }
//       }
//     );
//   });
// });

router.post('/glazes/:id/edit', function(req, res, next) {
  var emailCookie = req.cookies.userEmail;
  userCollection.findOne({ email: emailCookie }, function(err, recipe) {
    var recipeID = req.params.id;
    var recipeArray = recipe.glazeRecipes;
    var recipe = database.recipeFinder(recipeID, recipeArray);
    var date = recipe.dateAdded;
    userCollection.update({ email: emailCookie },
      { $pull:
        { glazeRecipes:
          { dateAdded: date }
        }
      }
    );
  });

  var date = Date();
  var recipeID = userCollection.id();
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
        testStatus: req.body.text_status,
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

// Submit Delete ====================
router.post('/glazes/:id/delete', function(req, res, next) {
  var emailCookie = req.cookies.userEmail;
  userCollection.findOne({ email: emailCookie }, function(err, recipe) {
    var recipeID = req.params.id;
    var recipeArray = recipe.glazeRecipes;
    var recipe = database.recipeFinder(recipeID, recipeArray);
    var date = recipe.dateAdded;
    userCollection.update({ email: emailCookie },
      { $pull:
        { glazeRecipes:
          { dateAdded: date }
        }
      }
    );
  });
  res.redirect('/glazes/show-all');
});






module.exports = router;
