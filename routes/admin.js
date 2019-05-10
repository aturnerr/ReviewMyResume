const User            = require("../models/user"),
      passport        = require("passport"),
      express         = require("express"),
      router          = express.Router(),
      isLoggedIn      = require("../middleware/is_logged_in"),
      AdminController = require("../controllers/admin");

/*=================================GET ROUTES=================================*/

router.get("/dashboard", isLoggedIn, AdminController.admin_show_dashboard);

router.get("/register", AdminController.admin_show_register);

router.get("/login", AdminController.admin_show_login);

router.get("/logout", isLoggedIn, AdminController.admin_logout);

/*================================POST ROUTES=================================*/

router.post("/register", AdminController.admin_register);

router.post("/login", passport.authenticate("local", {
                                    failureRedirect: "/login",
                                    failureFlash: "Invalid username or password"
                                }), AdminController.admin_login);

module.exports = router;
