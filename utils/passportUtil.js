const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./../models').Users;

var passportUtil = {
	init: (app) => {
		app.use(passport.initialize());
		app.use(passport.session());

		passport.serializeUser(function(user, done) {
       done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      Users.findById(id)
	      .then(user => {
	        done(null, user);
	      })
	      .catch(err => {
	  			done(err);
	      });
    });

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },

    function(req, email, password, done) {
    	process.nextTick(function() {
	    	Users.findOne({
	    		where: {email: email}
	    	})
	    		.then(user => {
	    			if (!user) {
	    				return done(null, false, {message: req.flash('loginMessage', 'No user found'), email: req.flash('emailValue', req.body.email)});
	    			}

	    			if (user.password !== password) {
	    				return done(null, false, {message: req.flash('loginMessage', 'Wrong password'), email: req.flash('emailValue', req.body.email)});
	    			}

	    			return done(null, user);

	    		})
	    		.catch(err => {
	    			return done(null, false, {message: req.flash('loginMessage', 'Unidefined error'), email: req.flash('emailValue', req.body.email)});
	    		});
    	});
    }));

	}
}

module.exports = passportUtil;