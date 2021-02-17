let express = require('express'),
  app = express(),
  env = process.env.NODE_ENV || "development",
  config = require('./config/config.json')[env];


app.use('/', express.static(__dirname + "/dist/"));
console.log(__dirname + "../CDN/JumentiX/a243/cdn")
app.use('/cdn', express.static("../CDN/JumentiX/a1/cdn"));

app.listen(config.port, function () {
  console.log('Jumentix-Vue-UI listening on port ' + config.port + '!');
});
