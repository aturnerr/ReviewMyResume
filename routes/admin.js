var User     = require("../models/user"),
    passport = require("passport"),
    express  = require('express');
    
var router = express.Router();

/*=================================GET ROUTES=================================*/

router.get("/register", function(req, res){
    res.render("register");
});

router.get("/login", function(req, res){
    res.render("login");
});

router.get("/logout", isLoggedIn, function(req, res){

    User.findById(req.user._id, function(err, user){
        if (err || !user){
            req.flash("error", "Oops, something went wrong!");
            res.redirect("/home");
        }
    });

    // logout user and redirect to home page
    req.logout();
    req.flash("success", "Succesfully Logged Out!");
    res.redirect("/");
});

/*================================POST ROUTES=================================*/

router.post("/register", function(req, res){

    // ensure that username is unique 
    User.register(new User(req.body.user), req.body.password, 
                                                            function(err, user){

        // if there's an error, let the user try again
        if (err){
            console.log(err);
            req.flash("error", "Username already in use!");
            res.redirect('/register');
        } 

        req.flash("success", "Successfully registered a new user!");
        res.redirect("/");
    })
});

/*=================================MIDDLEWARE=================================*/

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
}

module.exports = router;