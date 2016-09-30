var express     = require("express");
var fs         = require('fs');
var screenshot         = require("node-server-screenshot");

var port = process.env.PORT || 8080;

var app = express();

app.use('/static', express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));



app.get('/', function (request, response) {
  response.status(200).send({ "success" : true});
});

app.get('/screenshot/', function (request, response) {
  var filename = "screen_" + (new Date().getTime()) + Math.random() + ".png";
  console.log(filename);
  console.log(request.query.scrSht);
  screenshot.fromURL(request.query.scrSht, "public/" + filename, function(e){
    console.log("screen OK");
    response.status(200).send({ "success" : "static/" + filename});
  });

})

app.listen(port);
