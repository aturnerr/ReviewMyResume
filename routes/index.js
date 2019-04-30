const express         = require("express"),
      router          = express.Router(),
      isLoggedIn      = require("../middleware/is_logged_in"),
      IndexController = require("../controllers/index");

/*==================================ROUTES====================================*/

router.get("/", IndexController.show_landing_page);

// any other route is an error
router.get("/*", IndexController.show_error_page);

module.exports = router;
