var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/lizchangtest';
var displaySection = require('./displaysection');

router.get('/', function(req, res, next) {
  var fs = require('fs'),
    obj,
    projects,
    category;

    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Connection established to', url);
        var collection = db.collection('projects').find({section: 'ui'}).limit(2).toArray(function(err, docs) {
          if (err) console.log(err);
          docs.forEach(function(idx) {
            idx.category = idx.category.join(', ');
          });
          res.render('index', { projects: docs });
          db.close();
        });
      }
    });

  // fs.readFile('data.json', 'utf8', function (err, data) {
  //   if (err) throw err;
  //   obj = JSON.parse(data);
  //   projects = obj.projects.ui;
  //   projects.forEach(function(idx) {
  //     idx.category = idx.category.join(', ');
  //   });
  //   res.render('index', { projects: projects });
  // });
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
    res.render('index', { projects: projects});
  });
});

router.get('/graphic/:id', function(req, res, next) {
  var section = 'graphic',
      returnUrl = '/graphic';
    displaySection(req, res, next, section, returnUrl);
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Liz Chang' });
});

module.exports = router;
