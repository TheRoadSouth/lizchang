(function(){
  var currPath = window.location.pathname.split('/')[1],
    navElems = document.querySelectorAll(".nav-link"),
    UILink = document.getElementById('UI'),
    GraphicLink = document.getElementById('Graphic'),
    AboutLink = document.getElementById('About');

  [].forEach.call(navElems, function(el) {
    el.classList.remove("active");
  });

  (currPath === 'ui' || currPath === '') ?  UILink.className = "active" : "";
  (currPath === 'graphic') ? GraphicLink.className = "active" : "";
  (currPath === 'about') ? AboutLink.className = "active" : "";
})()
