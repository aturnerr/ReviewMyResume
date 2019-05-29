const express         = require("express"),
      router          = express.Router(),
      IndexController = require("../controllers/index");

/*==================================ROUTES====================================*/

router.get("/", IndexController.show_index);

// any other route is an error
router.get("/*", IndexController.show_error);

module.exports = router;
