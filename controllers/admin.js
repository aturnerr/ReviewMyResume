var User = require("../models/user");

exports.admin_show_dashboard = 

    function(req, res){
        res.render("dashboard");
    }

exports.admin_show_register = 

    function(req, res){
        res.render("register");
    }

exports.admin_show_login = 

    function(req, res){
        res.render("login");
    }

exports.admin_logout = 

    function(req, res){

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
    }

exports.admin_register = 

    function(req, res){

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
            res.redirect("/dashboard");
        });
    }

exports.admin_login = 

    function(req, res){

        // authenticate user
        User.findById(req.user._id, function(err, user){
            if (err || !user){
                // redirect to login page
                req.flash("error", "Oops, something went wrong!");
                res.redirect("/login");
            }
        });

        req.flash("success", "Successfully Logged In");
        res.redirect("/dashboard");
    }
