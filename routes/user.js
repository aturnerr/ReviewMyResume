const User            = require("../models/user"),
      passport        = require("passport"),
      express         = require("express"),
      router          = express.Router(),
      isLoggedIn      = require("../middleware/is_logged_in"),
      UserController  = require("../controllers/user");

/*=================================GET ROUTES=================================*/

// hub for accessing all the sites main features
router.get("/dashboard", isLoggedIn, UserController.show_dashboard);

// registration page
router.get("/register", UserController.show_register);

// login page
router.get("/login", UserController.show_login);

// logout user
router.get("/logout", isLoggedIn, UserController.logout_user);

/*================================POST ROUTES=================================*/

// register a new user
router.post("/register", UserController.register_user);

// log in an existing user
router.post("/login", passport.authenticate("local", {
                                    failureRedirect: "/login",
                                    failureFlash: "Invalid username or password"
                                }), UserController.login_user);

/*============================================================================*/

module.exports = router;
