const express         = require("express"),
      router          = express.Router(),
      IndexController = require("../controllers/index");

/*=================================GET ROUTES=================================*/

// landing page
router.get("/", IndexController.show_index);

// any other route is an error page
router.get("/*", IndexController.show_error);

/*============================================================================*/

module.exports = router;
