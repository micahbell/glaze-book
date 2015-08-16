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

  lowRangeFinder: function(rArray) {
    var lowTempArray = [];
    for (var i = 0; i < rArray.length; i++) {
      if(rArray[i]['tempRange'] == 'Low Fire') {
        lowTempArray.push(rArray[i]);
      }
    }
    return lowTempArray;
  },

  midRangeFinder: function(rArray) {
    var midTempArray = [];
    for (var i = 0; i < rArray.length; i++) {
      if(rArray[i]['tempRange'] == 'Mid Range') {
        midTempArray.push(rArray[i]);
      }
    }
    return midTempArray;
  },

  highRangeFinder: function(rArray) {
    var highTempArray = [];
    for (var i = 0; i < rArray.length; i++) {
      if(rArray[i]['tempRange'] == 'High Fire') {
        highTempArray.push(rArray[i]);
      }
    }
    return highTempArray;
  },

  shinyFinder: function(rArray) {
    var shinyArray = [];
    for (var i = 0; i < rArray.length; i++) {
      if(rArray[i]['surface'] === 'Shiny or Glossy') {
        shinyArray.push(rArray[i]);
      }
    }
    return shinyArray;
  },

  semiFinder: function(rArray) {
    var semiArray = [];
    for (var i = 0; i < rArray.length; i++) {
      if(rArray[i]['surface'] === 'Semi-Gloss') {
        semiArray.push(rArray[i]);
      }
    }
    return semiArray;
  },

  satinFinder: function(rArray) {
    var satinArray = [];
    for (var i = 0; i < rArray.length; i++) {
      if(rArray[i]['surface'] === 'Semi-Matte or Satin') {
        satinArray.push(rArray[i]);
      }
    }
    return satinArray;
  },

  matteFinder: function(rArray) {
    var matteArray = [];
    for (var i = 0; i < rArray.length; i++) {
      if(rArray[i]['surface'] === 'Matte') {
        matteArray.push(rArray[i]);
      }
    }
    return matteArray;
  },

  dryFinder: function(rArray) {
    var dryArray = [];
    for (var i = 0; i < rArray.length; i++) {
      if(rArray[i]['surface'] === 'Dry Matte') {
        dryArray.push(rArray[i]);
      }
    }
    return dryArray;
  },






};
