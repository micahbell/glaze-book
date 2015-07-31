function toggle() {
  var button = document.querySelector('.toggle');
  var overlay = document.querySelector('.glass');
  if (overlay.className === 'glass down') {
    overlay.className = 'glass up';
  } else {
    overlay.className = 'glass down';
  }
}

window.onload = function() {
  /* transition support ~= classList support */
  var preload = document.querySelector('.preload');
  preload.classList.remove('preload');
}
