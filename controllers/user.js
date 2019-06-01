const Notification = require("../models/notification"),
      User         = require("../models/user");

// regex for validation
const re_name       = /^[a-z]+$/i;        // a name can only be alphabetic characters
const re_email      = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const re_username   = /^[a-z0-9_]+$/i;    // a username can only contain alphanumeric characters and underscores
const re_occupation = /^[a-z ]+$/i;       // a job title can contain only alphabetic characters and spaces
const re_company    = /^[a-z0-9. _]+$/i;  // a company name contain alphanumeric characters, spaces, underscores and periods
const password_len  = 8;                  // minimum password length

exports.show_dashboard =

    (req, res) => {

        // update the users walkthrough progress
        if (req.user.started_walkthroughs[2]){
            req.user.completed_walkthroughs[2] = true;
            req.user.markModified('completed_walkthroughs');
        } else {
            req.user.started_walkthroughs[2] = true;
            req.user.markModified('started_walkthroughs');
        }
        req.user.save();

        // find notifications for the current user
        Notification.find({to:req.user.username}, (err, notifications) => {
            if (err || !notifications){
                res.render("dashboard", { page: "dashboard",
                                          user_type: req.user.type,
                                          notifications: []
                                        });
            } else {
                res.render("dashboard", { page: "dashboard",
                                        user_type: req.user.type,
                                        notifications: notifications
                                        });
            }
        });
    }

exports.show_register =

    (req, res) => {
        res.render("register", {
                                    retry : false,
                                    page: "register"
                                });
    }

exports.show_login =

    (req, res) => {
        res.render("login", {
                                page: "register"
                            });
    }

exports.logout_user =

    (req, res) => {

        // authenticate user
        User.findById(req.user._id, function(err, user){
            if (err || !user){
                // redirect to login page
                req.flash("error", "Oops, something went wrong!");
                res.redirect("/login");
            }
        });

        // logout user and redirect to home page
        req.logout();
        req.flash("success", "Succesfully Logged Out!");
        res.redirect("/login");
    }

exports.register_user =

    (req, res) => {

        // validate first name
        if (!re_name.test(req.body.user.fname)){
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

        // validate second name
        if (!re_name.test(req.body.user.lname)){
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

        // validate reviewer fields
        if (req.body.user.type === "reviewer"){

            // validate occupation
            if (!re_occupation.test(req.body.user.occupation)){
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

            // validate company name
            if (!re_company.test(req.body.user.company)){
                return res.render("register", {
                                            fname: req.body.user.fname,
                                            lname: req.body.user.lname,
                                            email: req.body.user.email,
                                            occupation: req.body.user.occupation,
                                            company: "",
                                            country: req.body.user.country,
                                            uname: req.body.user.username,
                                            error: "Invalid company!",
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
        User.register(new User(req.body.user), req.body.password, (err, user) =>{

            // if there's an error, let the user try again
            if (err){
                req.flash("error", "Username already in use!");
                res.redirect('/register');
            }

            req.flash("success", "Succesfully Signed Up- Please Log In Now!");
            res.redirect("/login");
        });
    }

exports.login_user =

    (req, res) => {

        // authenticate user
        User.findById(req.user._id, function(err, user){
            if (err || !user){
                // redirect to login page
                req.flash("error", "Oops, something went wrong!");
                res.redirect("/login");
            }
        });

        // decide next page based on user's walkthrough progress
        if (req.user.type === "student") {
            if (!req.user.completed_walkthroughs[0]){
                res.redirect("/recommendations");
            } else if (!req.user.completed_walkthroughs[1]){
                res.redirect("/resumes/upload");
            } else {
                req.flash("success", "Welcome back, " + req.user.username + "!");
                res.redirect("/dashboard");
            }
        } else {
            req.flash("success", "Welcome back, " + req.user.username + "!");
            res.redirect("/dashboard");
        }
    }
