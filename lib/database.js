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

  // tempFinder: function(rArray) {
  //   var tempArray = [];
  //   for (var i = 0; i < rArray.length; i++) {
  //     if(rArray[i]['favorite'] == 'on') {
  //       tempArray.push(rArray[i]);
  //     };
  //   };
  //   return tempArray;
  // }






};
