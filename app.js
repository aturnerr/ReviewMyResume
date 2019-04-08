var express = require("express");
var app = express();

// database setup
require('./models/db.js');

// Routes setup
var routes = require('./routes/routes.js');
app.use('/',routes);

// start server
app.listen(3000, function(req, res) {
  console.log("Serving port 3000")
});
