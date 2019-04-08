var express = require('express');
var router = express.Router();


router.get("/login", function(req, res){
    res.send("this is the login page");
});

module.exports = router;