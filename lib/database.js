module.exports = {

  recipeFinder: function(recID, rArray, iArray) {
    for (var i = 0; i < rArray.length; i++) {
      if(rArray[i]['_id'] == recID) {
        var index = i;
      };
    };
    return rArray[index];
  }
};
