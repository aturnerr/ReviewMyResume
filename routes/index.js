var Resume = require("../models/resume");
var express = require('express');
var fs = require('fs');

var router = express.Router();

router.get("/", function(req, res){
    res.render("home");
});

// any other route is an error
router.get("/*", function(req, res){
  res.send("Error! This page does not exist!");
});

module.exports = router;
