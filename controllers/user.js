const User         = require("../models/user");
const Notification = require("../models/notification");

const re_username = /^[a-z0-9_]+$/i;
const re_text = /^[a-z]+$/i;
const re_email = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const password_len = 8;

exports.user_show_dashboard =

    (req, res) => {

        // find notifications
        Notification.find({to:req.user.username}, (err, notifications) => {
            if (err || !notifications){
                res.render("dashboard", { page: "dashboard",
                                          user_type: req.user.type,
                                          notifications: []});
            }
            res.render("dashboard", { page: "dashboard",
                                          user_type: req.user.type,
                                          notifications: notifications});
        })
    }

exports.user_show_register =

    (req, res) => {
        res.render("register", { retry : false, page: "register"});
    }

exports.user_show_login =

    (req, res) => {
        res.render("login", {page: "register"});
    }

exports.user_logout =

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

exports.user_register =

    (req, res) => {

        // validate names
        if (!re_text.test(req.body.user.fname)){
            return res.render("register", {
                                        fname: "",
                                        lname: req.body.user.lname,
                                        email: req.body.user.email,
                                        occupation: req.body.user.occupation,
                                        company: req.body.user.company,
                                        country: req.body.user.country,
                                        uname: req.body.userusername,
                                        error: "Names must only contain letters!",
                                        retry: true,
                                        page: "register"
                                    });
        }

        if (!re_text.test(req.body.user.lname)){
            return res.render("register", {
                                        fname: req.body.user.fname,
                                        lname: "",
                                        email: req.body.user.email,
                                        occupation: req.body.user.occupation,
                                        company: req.body.user.company,
                                        country: req.body.user.country,
                                        uname: req.body.userusername,
                                        error: "Names must only contain letters!",
                                        retry: true,
                                        page: "register"
                                    });
        }

        // validate email
        if (!re_email.test(req.body.user.email)){
            return res.render("register", {
                                        fname: req.body.user.fname,
                                        lname: req.body.user.lname,
                                        email: "",
                                        occupation: req.body.user.occupation,
                                        company: req.body.user.company,
                                        country: req.body.user.country,
                                        uname: req.body.user.username,
                                        error: "Invalid email!",
                                        retry: true,
                                        page: "register"
                                    });
        }

        if (req.body.user.type === "reviewer"){

            // validate occupation
            if (!re_text.test(req.body.user.occupation)){
                return res.render("register", {
                                            fname: req.body.user.fname,
                                            lname: req.body.user.lname,
                                            email: req.body.user.email,
                                            occupation: "",
                                            company: req.body.user.company,
                                            country: req.body.user.country,
                                            uname: req.body.user.username,
                                            error: "Invalid occupation!",
                                            retry: true,
                                            page: "register"
                                       });
            }

            // validate company - company name may have numbers, eg.ws02
            if (!re_username.test(req.body.user.company)){
                return res.render("register", {
                                            fname: req.body.user.fname,
                                            lname: req.body.user.lname,
                                            email: req.body.user.email,
                                            occupation: req.body.user.occupation,
                                            company: "",
                                            country: req.body.user.country,
                                            uname: req.body.user.username,
                                            error: "Invalid occupation!",
                                            retry: true,
                                            page: "register"
                                        });
            }
        }

        // validate username
        if (!re_username.test(req.body.user.username)){
            return res.render("register", {
                                        fname: req.body.user.fname,
                                        lname: req.body.user.lname,
                                        email: req.body.user.email,
                                        occupation: req.body.user.occupation,
                                        company: req.body.user.company,
                                        country: req.body.user.country,
                                        uname: "",
                                        error: "Usernames can only have letters, numbers and underscores!",
                                        retry: true,
                                        page: "register"
                                    });
        }

        // validate password
        if (req.body.password.trim().length < password_len){
            return res.render("register", {
                                        fname: req.body.user.fname,
                                        lname: req.body.user.lname,
                                        email: req.body.user.email,
                                        occupation: req.body.user.occupation,
                                        company: req.body.user.company,
                                        country: req.body.user.country,
                                        uname: req.body.user.username,
                                        error: "Password too short!",
                                        retry: true,
                                        page: "register"
                                    });
        }

        // ensure that username is unique
        User.register(new User(req.body.user), req.body.password,
                                                            function(err, user){

            // if there's an error, let the user try again
            if (err){
                req.flash("error", "Username already in use!");
                res.redirect('/register');
            }
            user.num_requests = 5;
            req.flash("success", "Succesfully Signed Up- Please Log In Now!");
            res.redirect("/login");
        });
    }

exports.user_login =

    (req, res) => {

        // authenticate user
        User.findById(req.user._id, function(err, user){
            if (err || !user){
                // redirect to login page
                req.flash("error", "Oops, something went wrong!");
                res.redirect("/login");
            }
        });

        req.flash("success", "Welcome back, " + req.user.username + "!");
        res.redirect("/dashboard");
    }
