var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/lizchangtest';
var displayProject = require('./displaysection');

var displaySection = function(req, res, url, section) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      var collection = db.collection('projects').find({section: section}).toArray(function(err, docs) {
        if (err) console.log(err);
        docs.forEach(function(idx) {
          idx.category = idx.category.join(', ');
        });
        res.render('index', { projects: docs });
        db.close();
      });
    }
  });
}

router.get('/', function(req, res, next) {
  displaySection(req, res, url, 'ui');
});

router.get('/:section/:id', function(req, res, next) {
  var returnUrl = '/';
    displayProject(req, res, next, req.params.section, returnUrl);
});

router.get('/graphic', function(req, res, next) {
  displaySection(req, res, url, 'graphic');
});

// router.get('/graphic/:id', function(req, res, next) {
//   var section = 'graphic',
//       returnUrl = '/graphic';
//     displayProject(req, res, next, section, returnUrl);
// });

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Liz Chang' });
});

module.exports = router;
