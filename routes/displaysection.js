var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var uri = 'mongodb://45.55.23.140:27017/lizchang';

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

module.exports = displaySection;
