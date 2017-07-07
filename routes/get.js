var express = require('express');
var path = require('path');
var router = express.Router();
const controllers = require('./../controllers');

/* GET home page. */
router.get('/app', controllers.authController.isLoggedIn, controllers.routesController.app);
router.get('/login', controllers.authController.isLoggedOut, controllers.routesController.login);
router.get('/signup', controllers.authController.isLoggedOut, controllers.routesController.signup);
router.get('/logout', controllers.authController.logout);
router.get('/', controllers.authController.isLoggedOut, controllers.routesController.home);

router.get(express.static(path.join(__dirname, 'public')));

module.exports = router;


