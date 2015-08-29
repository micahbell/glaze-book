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

// Firing Temps ====================
router.get('/glazes/firing-temp', function(req, res, next) {
  res.render('glazes', {
    currentUser: req.cookies.currentUser,
    firingTemp: 'temps'
  })
});

// Low Range ====================
router.get('/glazes/firing-temp/low', function(req, res, next) {
  database.recipeFilter(req.cookies.userEmail, 'tempRange', 'Low Fire', function(selectRecipes) {
    if(selectRecipes.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', {
        currentUser: req.cookies.currentUser,
        lowRecipe: selectRecipes,
        firingTemp: 'low'
      })
    };
  });
});

// Mid Range ====================
router.get('/glazes/firing-temp/mid', function(req, res, next) {
  database.recipeFilter(req.cookies.userEmail, 'tempRange', 'Mid Range', function(selectRecipes) {
    if(selectRecipes.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', {
        currentUser: req.cookies.currentUser,
        midRecipe: selectRecipes,
        firingTemp: 'mid'
      })
    };
  });
});

// High Range ====================
router.get('/glazes/firing-temp/high', function(req, res, next) {
  database.recipeFilter(req.cookies.userEmail, 'tempRange', 'High Fire', function(selectRecipes) {
    if(selectRecipes.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', {
        currentUser: req.cookies.currentUser,
        highRecipe: selectRecipes,
        firingTemp: 'high'
      })
    };
  });
});

// Surface ====================
router.get('/glazes/surface', function(req, res, next) {
  res.render('glazes', { currentUser: req.cookies.currentUser, surface: 'surface' })
});

// Shiny ====================
router.get('/glazes/surface/shiny', function(req, res, next) {
  database.recipeFilter(req.cookies.userEmail, 'surface', 'Shiny or Glossy', function(selectRecipes) {
    if(selectRecipes.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', {
        currentUser: req.cookies.currentUser,
        shinyRecipe: selectRecipes,
        surface: 'shiny'
      })
    };
  });
});

// Semi-Gloss ====================
router.get('/glazes/surface/semi', function(req, res, next) {
  database.recipeFilter(req.cookies.userEmail, 'surface', 'Semi-Gloss', function(selectRecipes) {
    if(selectRecipes.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', {
        currentUser: req.cookies.currentUser,
        semiRecipe: selectRecipes,
        surface: 'semi'
      })
    };
  });
});

// Satin ====================
router.get('/glazes/surface/satin', function(req, res, next) {
  database.recipeFilter(req.cookies.userEmail, 'surface', 'Semi-Matte or Satin', function(selectRecipes) {
    if(selectRecipes.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', {
        currentUser: req.cookies.currentUser,
        satinRecipe: selectRecipes,
        surface: 'satin'
      })
    };
  });
});

// Matte ====================
router.get('/glazes/surface/matte', function(req, res, next) {
  database.recipeFilter(req.cookies.userEmail, 'surface', 'Matte', function(selectRecipes) {
    if(selectRecipes.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', {
        currentUser: req.cookies.currentUser,
        matteRecipe: selectRecipes,
        surface: 'matte'
      })
    };
  });
});

// Dry ====================
router.get('/glazes/surface/dry', function(req, res, next) {
  database.recipeFilter(req.cookies.userEmail, 'surface', 'Dry Matte', function(selectRecipes) {
    if(selectRecipes.length === 0) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', {
        currentUser: req.cookies.currentUser,
        dryRecipe: selectRecipes,
        surface: 'dry'
      })
    };
  });
});

// Favorites ====================
router.get('/glazes/favorites', function(req, res, next) {
  userCollection.findOne({ email: req.cookies.userEmail }, function(err, favRecipe) {
    var recipeArray = favRecipe.glazeRecipes;
    var favRecipe = database.favFinder(recipeArray);
    if(favRecipe.length === 0) {
      res.redirect('/glazes/show-all');
    } else {
    res.render('glazes', { currentUser: req.cookies.currentUser, favRecipe: favRecipe });
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
