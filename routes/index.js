var express = require('express');
var router = express.Router();
var displaySection = require('./displaySection');

router.get('/', function(req, res, next) {
  var fs = require('fs'),
    obj,
    projects;

  fs.readFile('data.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    projects = obj.projects.ui;
    res.render('index', { title: 'UI', projects: projects});
  });
});

router.get('/ui/:id', function(req, res, next) {
  var section = 'ui',
      returnUrl = '/';
    displaySection(req, res, next, section, returnUrl);
});

router.get('/graphic', function(req, res, next) {
  var fs = require('fs'),
    obj,
    projects;

  fs.readFile('data.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    projects = obj.projects.graphic;
    res.render('index', { title: 'UI', projects: projects});
  });
});

router.get('/graphic/:id', function(req, res, next) {
  var section = 'graphic',
      returnUrl = '/graphic';
    displaySection(req, res, next, section, returnUrl);
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

module.exports = router;
