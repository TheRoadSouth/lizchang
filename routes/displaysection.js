var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var uri = 'mongodb://localhost:27017/lizchangtest';

var displayProject = function(req, res, next, section, returnUrl) {
  var id,
    projTitle,
    projDesc,
    client,
    responsibleFor,
    url,
    completedAt,
    imageFullUrl,
    imageHeight,
    imageWidth;

    console.log(req);

    MongoClient.connect(uri, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Connection established to', uri);
        var collection = db.collection('projects').find({section: section, slug: req.params.id}).toArray(function(err, doc) {
          if (err) console.log(err);

          doc.forEach(function(idx) {
              id = idx.slug;
              projTitle = idx.title;
              projDesc = idx.description;
              client = idx.client;
              category = idx.category.join(', ');
              responsibleFor = idx.responsibleFor.join(', ');
              url = idx.url;
              completedAt = idx.completedAt;
              completedDate = idx.completedDate;
              imageFullUrl = idx.imageFullUrl;
              imageHeight = idx.imageHeight;
              imageWidth = idx.imageWidth;
          });

          res.render('project', {
            title: projTitle,
            projDesc: projDesc,
            returnUrl: returnUrl,
            imageHeight: imageHeight,
            imageWidth: imageWidth,
            client: client,
            category: category,
            responsibleFor: responsibleFor,
            url: url,
            completedAt: completedAt,
            completedDate: completedDate,
            imageFullUrl: imageFullUrl
          });

          db.close();
        });
      }
    });

};

module.exports = displayProject;
