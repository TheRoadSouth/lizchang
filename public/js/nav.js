module.exports = (function() {
  var currPath = window.location.pathname.split('/')[1],
    navElems = document.querySelectorAll(".nav-link"),
    UILink = document.getElementById('UI'),
    GraphicLink = document.getElementById('Graphic'),
    AboutLink = document.getElementById('About');

  [].forEach.call(navElems, function(el) {
    el.classList.remove("active");
  });

  UILink.className = currPath === 'ui' || currPath === '' ?  "active" : "";
  GraphicLink.className = currPath === 'graphic' ? "active" : "";
  AboutLink.className = currPath === 'about' ? "active" : "";
})();
