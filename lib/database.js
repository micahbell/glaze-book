module.exports = {

  // recipeFinder: function(recID, rArray) {
  //   for (var i = 0; i < rArray.length; i++) {
  //     if(rArray[i]['_id'] == recID) {
  //       var index = i;
  //     };
  //   };
  //   return rArray[index];
  // }

  recipeFinder: function(recID, rArray) {
    for (var i = 0; i < rArray.length; i++) {
      if(rArray[i]['dateAdded'] == recID) {
        var index = i;
      };
    };
    return rArray[index];
  }
};
