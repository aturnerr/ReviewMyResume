const User = require("../models/user");

const re_username = /^[a-z0-9_]+$/i;
const re_text = /^[a-z]+$/i;
const re_email = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

exports.admin_show_dashboard = 

    (req, res) => {
        res.render("dashboard");
    }

exports.admin_show_register = 

    (req, res) => {
        res.render("register");
    }

exports.admin_show_login = 

    (req, res) => {
        res.render("login");
    }

exports.admin_logout = 

    (req, res) => {

        User.findById(req.user._id, function(err, user){
            if (err || !user){
                req.flash("error", "Oops, something went wrong!");
                res.redirect("/home");
            }
        });

        // logout user and redirect to home page
        req.logout();
        req.flash("success", "Succesfully Logged Out!");
        res.redirect("/login");
    }

exports.admin_register = 

    (req, res) => {

        // validate names
        if (!re_text.test(req.body.user.fname) || 
                                            !re_text.test(req.body.user.lname)){
           req.flash("error", "Names must only contain letters!");
           res.redirect("/register");
        }

        // validate email
        if (!re_email.test(req.body.user.email)){
            req.flash("error", "Invalid Email");
            res.redirect("/register");
        }

        if (req.body.user.type === "reviewer"){

            // validate occupation
            if (!re_text.test(req.body.user.occupation)){
                req.flash("error", "Invalid occupation!");
                res.redirect("/register");
            }

            // validate company
            if (!re_username.test(req.body.user.company)){
                req.flash("error", "Invalid company name!");
                res.redirect("/register");
            }
        }

        // validate username
        if (!re_username.test(req.body.user.username)){
            req.flash("error", "Usernames can only have letters, numbers and \
                                underscores!");
            res.redirect("/register");
        }

        // validate password 
        if (req.body.password.trim().length < 8){
            req.flash("error", "Password too short!");
            res.redirect("/register");
        }
        

        // ensure that username is unique
        User.register(new User(req.body.user), req.body.password,
                                                            function(err, user){

            // if there's an error, let the user try again
            if (err){
                req.flash("error", "Username already in use!");
                res.redirect('/register');
            }

            req.flash("success", "Successfully registered a new user!");
            res.redirect("/dashboard");
        });
    }

exports.admin_login = 

    (req, res) => {

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
