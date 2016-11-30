var bibleApiController = function (Bible) {

  var getBaseUrl = function(req) {
    var url = req.protocol + '://' + req.get('host') + req.baseUrl;
    return url;
  };

  // Build object with hyperlinks
  var createBibleFromEntity = function(req, entity) {
    var bible = entity.toJSON();
    bible.url = getBaseUrl(req) + "/" + bible.code;
    bible.books_url = bible.url + "/books";
    return bible;
  };

  var get = function (req, res) {
    Bible.find({}, function (err, bibles) {
      if (err) {
        console.log(err);
        res.status(500);
        res.send(err);
      } else {
        // Build response with hyperlinks
        var biblesResponse = [];
        bibles.forEach(function (entity) {
          biblesResponse.push(createBibleFromEntity(req, entity));
        });
        res.json(biblesResponse);
      }
    });
  };

  var getById = function (req, res) {
    console.log("getByCode: " + req.params.id);
    Bible.findOne({code: req.params.id}, function (err, entity) {
      if (err) {
        console.log(err);
        res.status(500);
        res.send(err);
      } else {
        res.json(createBibleFromEntity(req, entity));
      }
    });
  };

  return {
    get: get,
    getById: getById
  };
};

module.exports = bibleApiController;