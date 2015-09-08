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

  // recentAddFinder: function(user) {
  //   console.log('fdjfkdjaklfdjsak DATE------',user.glazeRecipes);
  //   var dateArray = [];
  //   for (var i = 0; i < user.glazeRecipes.length; i++) {
  //     user.glazeRecipes.sort(function(a, b) {
  //       return new Date(a.dateAdded) - new Date(b.dateAdded)
  //     })
  //     // console.log('++++++++++++++++++++++++++++++++',user.glazeRecipes[i].dateAdded);
  //   }
  // },


    // recent.sort(function(a,b) {
    //     return new Date(a.start).getTime() - new Date(b.start).getTime()
    // });

    // array.sort(function(a, b) {
    // a = new Date(a.dateModified);
    // b = new Date(b.dateModified);
    // return a>b ? -1 : a<b ? 1 : 0;
// });


};





//
