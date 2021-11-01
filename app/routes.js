const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
// _id: new mongoose.mongo.ObjectID(req.body.id)
module.exports = function (app, passport, db) {
	// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function (req, res) {
		res.render('index.ejs');
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function (req, res) {
		db.collection('orders')
			.find()
			.toArray((err, result) => {
				if (err) return console.log(err);
				res.render('profile.ejs', {
					// with passport, the user is sent as part of the request
					user: req.user,
					orders: result,
				});
			});
	});

	// LOGOUT ================================
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	// message board routes ===============================================================

	app.post('/order', (req, res) => {
		let order = req.body.costumerOrder.split(' ');

		if (order.length > 2) {
			order.splice(2, 0, 'with');
		}
		if (order.length > 3) {
			order.splice(-1, 0, 'and');
		}
		let first = order.splice(0, 3);
		let last = order.splice(-2);
		console.log('first', first);
		console.log('last', last);
		order = order.join(', ');
		// order.splice();
		order = `${first.join(' ')} ${order} ${last.join(' ')}`;
		// if (order.split(' ').length > 2) {
		// 	order = order.split(' ').splice(-1, 0, 'and').join(' ');
		// }
		console.log('final', order);
		db.collection('orders').insertOne(
			{
				costumerName: req.body.costumerName,
				orders: order,
				status: 'incomplete',
				baristaName: '',
			},
			(err, result) => {
				if (err) return console.log(err);
				console.log('saved to database');
				res.redirect('/');
			}
		);
	});

	app.put('/upVote', (req, res) => {
		console.log(req.body.baristaName);
		db.collection('orders').findOneAndUpdate(
			{ orders: req.body.costumerOrder },
			{
				$set: {
					baristaName: req.body.baristaName,
					status: 'complete',
				},
			},
			{
				sort: { _id: -1 },
			},
			(err, result) => {
				if (err) return res.send(err);

				res.send(result);
			}
		);
	});

	app.put('/downVote', (req, res) => {
		req.body.costumerOrder;
		db.collection('orders').findOneAndUpdate(
			{ orders: req.body.costumerOrder, status: req.body.status },
			{
				$set: {
					status: 'incomplete',
				},
			},
			{
				sort: { _id: -1 },
			},
			(err, result) => {
				if (err) return res.send(err);
				res.send(result);
			}
		);
	});

	app.delete('/delete', (req, res) => {
		console.log(req.body);
		db.collection('orders').findOneAndDelete(
			{ _id: new mongoose.mongo.ObjectID(req.body.id) },
			(err, result) => {
				if (err) return res.send(500, err);
				res.send('Message deleted!');
			}
		);
	});

	app.delete('/deleteAll', (req, res) => {
		db.collection('orders').deleteMany({}, (err, result) => {
			if (err) return res.send(500, err);
			res.send('Message deleted!');
		});
	});

	app.delete('/deleteCompleted', (req, res) => {
		db.collection('orders').deleteMany(
			{ status: 'complete' },
			(err, result) => {
				if (err) return res.send(500, err);
				res.send('Message deleted!');
			}
		);
	});

	// =============================================================================
	// AUTHENTICATE (FIRST LOGIN) ==================================================
	// =============================================================================

	// locally --------------------------------
	// LOGIN ===============================
	// show the login form
	app.get('/login', function (req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post(
		'/login',
		passport.authenticate('local-login', {
			successRedirect: '/profile', // redirect to the secure profile section
			failureRedirect: '/login', // redirect back to the signup page if there is an error
			failureFlash: true, // allow flash messages
		})
	);

	// SIGNUP =================================
	// show the signup form
	app.get('/signup', function (req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post(
		'/signup',
		passport.authenticate('local-signup', {
			successRedirect: '/profile', // redirect to the secure profile section
			failureRedirect: '/signup', // redirect back to the signup page if there is an error
			failureFlash: true, // allow flash messages
		})
	);
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();

	res.redirect('/');
}
