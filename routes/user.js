const User            = require("../models/user"),
      passport        = require("passport"),
      express         = require("express"),
      router          = express.Router(),
      isLoggedIn      = require("../middleware/is_logged_in"),
      UserController  = require("../controllers/user");

/*=================================GET ROUTES=================================*/

router.get("/dashboard", isLoggedIn, UserController.user_show_dashboard);

router.get("/register", UserController.user_show_register);

router.get("/login", UserController.user_show_login);

router.get("/logout", isLoggedIn, UserController.user_logout);

/*================================POST ROUTES=================================*/

router.post("/register", UserController.user_register);

router.post("/login", passport.authenticate("local", {
                                    failureRedirect: "/login",
                                    failureFlash: "Invalid username or password"
                                }), UserController.user_login);

module.exports = router;
