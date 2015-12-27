var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var displayProject = require('./displayproject');
var displaySection = require('./displaysection');

router.get('/', function(req, res, next) {
  displaySection(req, res, 'ui');
});

router.get('/:section/:id', function(req, res) {
  var returnUrl = '/';
  displayProject(req, res, returnUrl);
});

router.get('/graphic', function(req, res, next) {
  displaySection(req, res, 'graphic');
});

router.get('/about', function(req, res, next) {
  MongoClient.connect(req.app.settings.dburl, function (err, db) {
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
