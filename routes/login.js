var User     = require("../models/user"),
    passport = require("passport"),
    express  = require('express');
    
var router = express.Router();

/*=================================GET ROUTES=================================*/

router.get("/register", function(req, res){
    res.render("register")
});

router.get("/login", function(req, res){
    res.render("login")
});

router.get("/logout", function(req, res){
    // update last logout time
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

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password"
}), function(req, res){

    //  verify user
    User.findById(req.user._id, function(err, user){
        if (err || !user){
            // redirect to login page
            req.flash("error", "Oops, something went wrong!");
            res.redirect("/admin");
        }
    });

    // login user and redirect to home page
    req.flash("success", "Successfully Logged In");
    res.redirect("/");
});

router.post("/register", function(req, res){

    // verify username 
    User.register(new User({username: req.body.username}), req.body.password, 
                                                            function(err, user){

        if (err){
            console.log(err);
            req.flash("error", "Username already in use!");
            res.redirect('/register');
        }

        // logs user in and runs 'serialize' method
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully Logged In!");
            res.redirect("/code");
        });
    });

});

/*=================================MIDDLEWARE=================================*/

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}


module.exports = router;