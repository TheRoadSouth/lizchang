var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/lizchangtest';
var displayProject = require('./displayproject');

var displaySection = function(req, res, url, section) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
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
  displayProject(req, res, next, returnUrl);
});

router.get('/graphic', function(req, res, next) {
  displaySection(req, res, url, 'graphic');
});

router.get('/about', function(req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      var collection = db.collection('site').find().toArray(function(err, doc) {
        res.render('about', {
          pageTitle: 'About Liz Chang',
          title: doc[0].about.bio.title,
          description: doc[0].about.bio.description,
          experience: doc[0].about.experience,
          education: doc[0].about.education
        });
        db.close();
      });
    }
  });

});

module.exports = router;
