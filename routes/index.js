var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
    res.send("Hello World!");
});

router.get("/*", function(req, res){
    res.send("Error");
})

module.exports = router;
