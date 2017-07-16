const express = require('express');
const router = express.Router();
const passport = require('passport');
const controllers = require('./../controllers');


router.post('/signup', controllers.authController.signup);
router.post('/login', controllers.authController.login, passport.authenticate('local-login', {
  successRedirect : '/app', // redirect to the secure profile section
  failureRedirect : '/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

module.exports = router;
