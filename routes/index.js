var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var userCollection = db.get('users');
var bcrypt = require('bcryptjs');
var userValidation = require('../lib/user-validation');
var database = require('../lib/database');
var multer  = require('multer');
var upload = multer({
  dest: __dirname + '/../public/uploads/',
  limits: {fileSize: 1000000, files: 1}
})

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/glazes', function(req, res, next) {
  res.render('glazes', { currentUser: req.cookies.currentUser });
});

// All Recipes ====================
router.get('/glazes/show-all', function(req, res, next) {
  userCollection.findOne({ email: req.cookies.userEmail }, function(err, recipes) {
    if(!recipes) {
      res.redirect('/glazes');
    } else {
      res.render('glazes', {
        currentUser: req.cookies.currentUser,
        recipes: recipes.glazeRecipes
      })
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
        lowRecipes: selectRecipes,
        firingTemp: 'Low Fire Glazes'
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
        midRecipes: selectRecipes,
        firingTemp: 'Mid Range Glazes'
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
        highRecipes: selectRecipes,
        firingTemp: 'High Fire Glazes'
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
        shinyRecipes: selectRecipes,
        surface: 'Shiny or Glossy Glazes'
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
        semiRecipes: selectRecipes,
        surface: 'Semi-Gloss Glazes'
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
        satinRecipes: selectRecipes,
        surface: 'Semi-Matte or Satin Glazes'
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
        matteRecipes: selectRecipes,
        surface: 'Matte Glazes'
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
        dryRecipes: selectRecipes,
        surface: 'Dry Matte Glazes'
      })
    };
  });
});

// Favorites ====================
router.get('/glazes/favorites', function(req, res, next) {
  userCollection.findOne({ email: req.cookies.userEmail }, function(err, recipes) {
    var recipes = database.favFinder(recipes.glazeRecipes);
    if(recipes.length === 0) {
      res.redirect('/glazes/show-all');
    } else {
      res.render('glazes', {
        currentUser: req.cookies.currentUser,
        favRecipe: recipes
      })
    };
  });
});

// Recently Added ====================
// router.get('/glazes/recently-added', function(req, res, next) {
  // $natural: -1 ?
//   userCollection.findOne({ email: req.cookies.userEmail }).sort({ $natural: -1 }, function(err, recipes) {
//     if(!recipes) {
//       res.redirect('/glazes');
//     } else {
//       res.render('glazes', {
//         currentUser: req.cookies.currentUser,
//         recipes: recipes.glazeRecipes
//       })
//     };
//   });
// });

// db.collection.find( { $query: {}, $orderby: { age : -1 } } )

// Show One ====================
router.get('/glazes/:id', function(req, res, next) {
  userCollection.findOne({ email: req.cookies.userEmail }, function(err, recipe) {
    var recipe = database.recipeFinder(req.params.id, recipe.glazeRecipes);
    // var ingredients = recipe.ingredients;
    // var amounts = recipe.amounts;
    // var addIngredients = recipe.addIns;
    // var addAmounts = recipe.addAmounts;
    if(recipe) {
      res.render('glazes', {
        oneRecipe: recipe,
        ingredients: recipe.ingredients,
        amounts: recipe.amounts,
        addIngredients: recipe.addIns,
        addAmounts: recipe.addAmounts,
        currentUser: req.cookies.currentUser
      });
    };
  });
});

// Edit ====================
router.get('/glazes/:id/edit', function(req, res, next) {
  userCollection.findOne({ email: req.cookies.userEmail }, function(err, recipe) {
    var recipe = database.recipeFinder(req.params.id, recipe.glazeRecipes);
    if(recipe) {
      res.render('glazes', {
        editRecipe: recipe,
        ingredients: recipe.ingredients,
        amounts: recipe.amounts,
        addIngredients: recipe.addIns,
        addAmounts:recipe.addAmounts,
        currentUser: req.cookies.currentUser
      });
    };
  });
});

// Show All ====================
router.post('/show-all', upload.single('image'), function(req, res, next) {
  var date = Date();
  var recipeID = userCollection.id();
  // if(req.cookies.userEmail === 'demo@gmail.com') {
  //   res.redirect('/glazes/show-all');
  // } else {
    userCollection.update({ email: req.cookies.userEmail },
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
          image: req.file
        }
      }
    });
    res.redirect('/glazes/show-all');
  // }
});

// Submit Edit ====================
router.post('/glazes/:id/edit', function(req, res, next) {
  userCollection.findOne({ email: req.cookies.userEmail }, function(err, recipe) {
    var recipe = database.recipeFinder(req.params.id, recipe.glazeRecipes);
    // If req.cookies.userEmail = demo
    userCollection.update({ email: req.cookies.userEmail },
      { $pull:
        { glazeRecipes:
          { dateAdded: recipe.dateAdded }
        }
      }
    );
  });

  var date = Date();
  var recipeID = userCollection.id();
  userCollection.update({ email: req.cookies.userEmail },
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

// Submit Delete ====================
router.post('/glazes/:id/delete', function(req, res, next) {
  userCollection.findOne({ email: req.cookies.userEmail }, function(err, recipe) {
    var recipe = database.recipeFinder(req.params.id, recipe.glazeRecipes);
    // If req.cookies.userEmail = demo
    userCollection.update({ email: req.cookies.userEmail },
      { $pull:
        { glazeRecipes:
          { dateAdded: recipe.dateAdded }
        }
      }
    );
  });
  res.redirect('/glazes/show-all');
});






module.exports = router;
