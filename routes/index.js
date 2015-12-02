var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var fs = require('fs'),
    obj,
    projects;

  fs.readFile('data.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    projects = obj.projects.ui;
    res.render('index', { title: 'UI', section: 'ui', projects: projects});
  });
});

router.get('/ui/:id', function(req, res, next) {
  var fs = require('fs'),
    obj,
    projects,
    id,
    projTitle,
    projDesc,
    client,
    responsibleFor,
    url,
    completedAt,
    imageFullUrl,
    imageHeight,
    imageWidth;

  fs.readFile('data.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    projects = obj.projects.ui;

    projects.forEach(function(idx) {
      if (idx.slug === req.params.id) {
        id = idx.slug;
        projTitle = idx.title;
        projDesc = idx.description;
        client = idx.client;
        responsibleFor = idx.responsibleFor;
        url = idx.url;
        completedAt = idx.completedAt;
        imageFullUrl = idx.imageFullUrl;
        imageHeight = idx.imageHeight;
        imageWidth = idx.imageWidth;
      }
    });
    res.render('project', { title: projTitle, projDesc: projDesc, imageHeight: imageHeight, imageWidth: imageWidth, client: client, responsibleFor: responsibleFor, url: url, completedAt: completedAt, imageFullUrl: imageFullUrl });
  });
});

router.get('/graphic', function(req, res, next) {
  res.render('index', { title: 'Graphic' });
});

router.get('/graphic/:id', function(req, res, next) {
  res.render('project', { title: 'Graphic', id: req.params.id });
});

router.get('/about', function(req, res, next) {
  res.render('index', { title: 'About' });
});

module.exports = router;
