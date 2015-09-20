module.exports = {

  recipeFinder: function(recID, rArray) {
    for (var i = 0; i < rArray.length; i++) {
      if(rArray[i]['_id'] == recID) {
        var index = i;
      };
    };
    return rArray[index];
  },

  favFinder: function(rArray) {
    var favArray = [];
    for (var i = 0; i < rArray.length; i++) {
      if(rArray[i]['favorite'] == 'on') {
        favArray.push(rArray[i]);
      };
    };
    return favArray;
  },

  recipeFilter: function(email, attribute, value, cb) {
    var db = require('monk')(process.env.MONGOLAB_URI);
    var userCollection = db.get('users');
    userCollection.findOne({ email: email }, function(err, recipes) {
      var newArray = [];
      var recipeArray = recipes.glazeRecipes;
      for (var i = 0; i < recipeArray.length; i++) {
        if(recipeArray[i][attribute] == value) {
          newArray.push(recipeArray[i]);
        };
      };
      cb(newArray);
    });
  },


};





//
