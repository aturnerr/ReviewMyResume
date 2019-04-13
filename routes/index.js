var Resume = require("../models/resume");
var express = require('express');
var fs = require('fs');

var router = express.Router();

router.get("/", function(req, res){
    res.render("home");
});

// router.get("/*", function(req, res){
//     res.send("Error");
// })

router.get("/resumes", function(req, res){
    // res.render("resumes")
    Resume.find(function(err, resumes) {
      if(!err) {
        res.send(resumes)
      } else {
        res.sendStatus(404);
      }
    })
});

router.get("/resumes/view", function(req,res) {
  var data = fs.readFileSync('./test.pdf');
  res.contentType("application/pdf");
  res.send(data);
});

module.exports = router;
