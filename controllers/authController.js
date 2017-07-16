const path = require('path');
const passport = require('passport');
const Users = require('./../models').Users;
const GoogleUsers = require('./../models').GoogleUsers;

const authController = {
	login: (req, res, next) => {

		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('password', 'Password is required').notEmpty();

		var errors = req.validationErrors();

		if (errors) {
			res.render(path.resolve('./public/login/index.ejs'), { 
				errors: errors,
				email: req.body.email,
				message: ''
			});
		} else {
			next();
		}

	},

	signup: (req, res, err) => {

		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('name', 'Name is is required').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('confirm-password', 'Confirm password is required').notEmpty();
		req.checkBody('confirm-password', 'Minimal password length - 6 symbols').len(6, 20);
		req.checkBody('confirm-password', 'Passwords do not match').equals(req.body.password);

		var errors = req.validationErrors();

		if (errors) {
			renderSingupPage(errors);
		} else {
			Users.findOne({
    		where: {email: req.body.email}
    	})
	    	.then(user => {
	    		if (user) {
						renderSingupPage([{msg: 'That email is already taken.'}]);
	    		} else {
    			return Users
		    		.create({
		    			email: req.body.email,
		    			name: req.body.name,
		    			password: req.body.password
		    		})
		    		.then(user => {
		    			req.logIn(user, function(err) {
		    				if (err) {
		    					console.log(err);
		    				} else {
		    					res.redirect('/app');
		    				}
		    			});
		    		})
		    		.catch(err => {
		    			console.log(err, 'error');
		    		});
	    		}
	    	})
	    	.catch((err)=> {
	    		console.log(err);
	    	});
		}

		function renderSingupPage(errors) {
			res.render(path.resolve('./public/signup/index.ejs'), { 
				errors: errors,
				email: req.body.email,
				name: req.body.name
			});
		}
	},

  getUser: (req, res, err) => {
    res.send(req.user);
  },

	logout: (req, res, err) => {
		req.logout();
    res.redirect('/');
	},

	isLoggedIn: (req, res, next) => {
		req.isAuthenticated()? next() : res.redirect('/login');
	},

	isLoggedOut: (req, res, next) => {
		req.isAuthenticated()? res.redirect('/app') : next();
	}
}

module.exports = authController;