var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var displaySection = function(req, res, section, title, desc) {
  MongoClient.connect(req.app.settings.dburl, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      var collection = db.collection('projects').find({section: section}).toArray(function(err, docs) {
        if (err) console.log(err);
        docs.forEach(function(idx) {
          idx.category = idx.category.join(', ');
        });
        res.render('index', {
          projects: docs ,
          title: title,
          description: desc
        });
        db.close();
      });
    }
  });
}

module.exports = displaySection;
