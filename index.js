var express     = require("express");
var fs         = require('fs');
var guid = require('guid');
var childProcess = require('child_process');

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

  var filename = guid.raw() + '.png';
  var filenameFull = './public/' + filename;
  var childArgs = [
    'rasterize.js',
    request.query.scrSht,
    filenameFull,
    '',
    1
  ];

  //grap the screen
  childProcess.execFile('bin/phantomjs', childArgs, function(error, stdout, stderr){
    console.log("Grabbing screen for: " + request.body.address);
    if(error !== null) {
      console.log("Error capturing page: " + error.message + "\n for address: " + childArgs[1]);
      return response.json(500, { 'error': 'Problem capturing page.' });
    } else {
      //load the saved file
      fs.readFile(filenameFull, function(err, temp_png_data){
        return response.json(200, { 'success': filenameFull.replace("public", "static") });
      });
    }
  });

})

app.listen(port);
