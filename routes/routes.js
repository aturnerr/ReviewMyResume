var express = require('express');
var router = express.Router();

var controller = require('../controllers/controller.js');

router.get('/test',controller.welcome);

router.get('/users',controller.findAllUsers);

router.get('/users/id/:id',controller.findOneUser);

router.get('/users/name/:name',controller.findUserByName);

module.exports = router;
