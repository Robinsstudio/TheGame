const express = require('express');
const router = express.Router();

router.use('/api/', require('./routes'));

if (process.env.NODE_ENV === 'production') {
	const serveStatic = express.static(__dirname + '/build');
	router.use('/', (req, res) => {
		serveStatic(req, res, function() {
			res.sendFile(__dirname + '/build/index.html');
		});
	});

	console.log('The Game is running.');
}

module.exports = router;