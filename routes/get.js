const express = require('express');
const path = require('path');
const router = express.Router();
const controllers = require('./../controllers');
const passport = require('passport');

/* GET home page. */
router.get('/app', controllers.authController.isLoggedIn, controllers.routesController.app);
router.get('/user', controllers.authController.isLoggedIn, controllers.authController.getUser);
router.get('/login', controllers.authController.isLoggedOut, controllers.routesController.login);
router.get('/signup', controllers.authController.isLoggedOut, controllers.routesController.signup);
router.get('/logout', controllers.authController.logout);
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/app');
  }
);
router.get('/', controllers.authController.isLoggedOut, controllers.routesController.home);

router.get(express.static(path.join(__dirname, 'public')));

module.exports = router;


