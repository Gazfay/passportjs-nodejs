const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./../models').Users;
const GoogleUsers = require('./../models').GoogleUsers;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const configAuth = require('./../config/auth');

var passportUtil = {
	init: (app) => {
		app.use(passport.initialize());
		app.use(passport.session());

		passport.serializeUser(function(user, done) {
       done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      Promise.all([
        Users.findById(id),
        GoogleUsers.findById(id)
        ]
      )
      .then(users => {
        users.forEach((user)=> {
          if (user !== null) {
            done(null, user);
          }
        });
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


    passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
    },
    function(token, refreshToken, profile, done) {

      process.nextTick(function() {

        GoogleUsers.findOne({
          where: {id: profile.id}
        })
          .then(user => {
            if(user !== null) {
              return done(null, user);
            } else {
              GoogleUsers.create({
                id: profile.id,
                token: token,
                name: profile.displayName,
                email: profile.emails[0].value
              })
              .then(user => {
                return done(null, user);
              })
              .catch(err => {
                return done(null, false, err);
              });
            }


          })
          .catch(err => {
            console.log('err', err);
            return done(null, false, err);
          });
      });
    }));




	}
}

module.exports = passportUtil;