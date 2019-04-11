var Reviewer   = require("../models/reviewer"),
    passport = require("passport"),
    express  = require('express');
    
var router = express.Router();

/*=================================GET ROUTES=================================*/

router.get("/reviewer/home", function(res, req){
    res.send("Reviewer Home Page");
});

router.get("/reviewer/register", function(req, res){
    res.render("reviewer-register");
});

router.get("/reviewer/login", function(req, res){
    res.render("login");
});

router.get("/reviewer/logout", function(req, res){

    Reviewer.findById(req.reviewer._id, function(err, user){
        if (err || !user){
            req.flash("error", "Oops, something went wrong!");
            res.redirect("/home");
        }
    });

    // logout user and redirect to home page
    req.logout();
    res.redirect("/");
});

/*================================POST ROUTES=================================*/

router.post("/reviewer/login", passport.authenticate("local"), function(req, res){
    
    alert("Posting");

    //  verify user
    Reviewer.findById(req.reviewer._id, function(err, reviewer){
        if (err || !user){
            res.redirect("/reviewer/login");
        }
    });
    
    // login user and redirect to home page
    res.redirect("/reviewer/home");
});

router.post("/reviewer/register", function(req, res){

    // verify username 
    Reviewer.register(new Reviewer(req.body.reviewer), 
                                    req.body.reviewer.password, 
                                    function(err, reviewer){

        if (err){
            console.log(err);
            res.redirect('/reviewer/register');
        }

        // logs user in and runs 'serialize' method
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
    });

});

/*=================================MIDDLEWARE=================================*/

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
}

module.exports = router;