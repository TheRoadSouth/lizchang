var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var displayProject = function(req, res, returnUrl) {
    MongoClient.connect(req.app.settings.dburl, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        var collection = db.collection('projects').find({section: req.params.section, slug: req.params.id}).toArray(function(err, doc) {
          if (err) console.log(err);
          var project = doc[0];

          res.render('project', {
            title: project.title,
            projDesc: project.description,
            returnUrl: req.params.section === 'graphic' ? '/graphic' : '/',
            imageHeight: project.imageHeight,
            imageWidth: project.imageWidth,
            client: project.client,
            category: project.category.join(', '),
            responsibleFor: project.responsibleFor.join(', '),
            url: project.url,
            completedAt: project.completedAt,
            completedDate: project.completedDate,
            imageFullUrl: project.imageFullUrl
          });

          db.close();
        });
      }
    });
};

module.exports = displayProject;
