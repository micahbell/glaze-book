module.exports = {

  signupValidation: function(u, e, p, c, duplicateError) {
    var errorArray = [];
    if(u === '' || e === '' || p === '' || c === '') {
      errorArray.push('All fields must be filled in.')
    }
    if(p != c) {
      errorArray.push('Passwords do not match.');
    };
    if(p.length < 8) {
      errorArray.push('Password must be at least 8 characters in length.');
    };
    if(duplicateError > 0){
      errorArray.push('There is already an account associated with that email address.');
    };

    return errorArray;
  },

  loginValidation: function(e, p, openSesame) {
    var errorArray = [];
    if(e === '' || p === '') {
      errorArray.push('All fields must be filled in.');
    };
    if(openSesame > 0) {
      errorArray.push('Invalid login or password.');
    };

    return errorArray;
  },

  existingUser: function(e, callback) {
    var db = require('monk')(process.env.MONGO);
    var userCollection = db.get('users');
    var errors = 0;
    userCollection.findOne({ email: e }, function(err, user) {
      if(user) {
        error = 1;
      } else {
          error = 0;
      };
      callback(error);
    });
  },

  loginUser: function(e, p, callback) {
    var db = require('monk')(process.env.MONGO);
    var userCollection = db.get('users');
    var bcrypt = require('bcryptjs');
    var error = 0;
    userCollection.findOne({ email: e }, function(err, user) {
      if(user) {
        var username = user.username;
        var compare = bcrypt.compareSync(p, user.password);
        error = 0;
      } if(compare) {
          error = 0;
      } else {
          error = 1;
      };
      callback(error, username);
    });
  }
};








//
