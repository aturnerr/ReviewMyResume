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

router.get("/upload", (req, res) => {
    res.render("upload");
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

router.post("/login", passport.authenticate("local", {
                                    failureRedirect: "/login",
                                    failureFlash: "Invalid username or password"
                                }), function(req, res){

    // authenticate user
    User.findById(req.user._id, function(err, user){
        if (err || !user){
            // redirect to login page
            req.flash("error", "Oops, something went wrong!");
            res.redirect("/login");
        }
    });

    req.flash("success", "Successfully Logged In");
    res.redirect("/");
});
const storage = new GridFsStorage({
    url: "mongodb+srv://test:test@cluster1-sfksn.mongodb.net/test?retryWrites=true",
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });

router.post('upload/file', multer({ storage }).single("file"), (req, res) => {
    res.json({file: req.file});
});
/*=================================MIDDLEWARE=================================*/

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
    
    res.redirect("/login");
}

module.exports = router;
