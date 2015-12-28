var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var displayProject = require('./displayproject');
var displaySection = require('./displaysection');

router.get('/', function(req, res, next) {
  var title = 'Liz Chang | UI/UX Design',
      desc = 'Liz Chang is a UI/UX Designer in San Francisco. Visual and Product Design for Web and Mobile Platforms.';
  displaySection(req, res, 'ui', title, desc);
});

router.get('/:section/:id', function(req, res) {
  var returnUrl = '/';
  displayProject(req, res, returnUrl);
});

router.get('/graphic', function(req, res, next) {
  var title = 'Liz Chang | Graphic Design',
      desc = 'Liz Chang, Graphic Design Portfolio. Graphic Design and Print Work.';
  displaySection(req, res, 'graphic', title, desc);
});

router.get('/about', function(req, res, next) {
  MongoClient.connect(req.app.settings.dburl, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      var collection = db.collection('site').find().toArray(function(err, doc) {
        res.render('about', {
          pageTitle: 'Liz Chang | About',
          metaDesc: 'About Liz Chang, UI/UX Designer in San Francisco, CA. From Visual to Product Design.',
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
