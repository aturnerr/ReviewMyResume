var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
    res.render("hullo");
});

router.get("/*", function(req, res){
    res.send("Error");
})

module.exports = router;
