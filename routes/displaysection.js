var displaySection = function(req, res, next, section, returnUrl) {
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
    projects = obj.projects[section];

    projects.forEach(function(idx) {
      if (idx.slug === req.params.id) {
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
      }
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
  });
}

module.exports = displaySection;
