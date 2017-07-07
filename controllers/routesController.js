const path = require('path');
const ejs = require('ejs');

const routesController = {
	app: (req, res, err) => {
		console.log(req.user, 'User app');
		res.sendfile(path.resolve('./public/app/index.html'));
	},

	home: (req, res, err) => {
		res.sendfile(path.resolve('./public/home/index.html'));
	},

	login: (req, res, err) => {
		res.render(path.resolve('./public/login/index.ejs'), { 
			errors: '',
			message: req.flash('loginMessage'), 
			email: req.flash('emailValue')
		});
	},

	signup: (req, res, err) => {
		res.render(path.resolve('./public/signup/index.ejs'), { 
			errors: [],
			email: '',
			name: ''
		});
	}
}

module.exports = routesController;