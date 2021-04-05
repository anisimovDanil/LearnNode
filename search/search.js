const express = require('express'),
	  bodyParser = require('body-parser');

const db = require('./../connect_db/connect.js');
const router = express.Router();

//router.set('view engine', 'ejs');

const urlencodedParser = bodyParser.urlencoded({extended: false});

/*router.use("/search", function(req, res){
	console.log(req.query);
	res.render('search.ejs', {results: null});
});*/


router.get('/search?:search', (req, res, next) => {
	//res.sendFile(__dirname + './../views/search.html');

	res.render('search.ejs', {results: null});
	//res.render("search.ejs", {results: ["goose", "duck"]});
});

router.post('/search', urlencodedParser, (req, res, next) => {
	let search = req.body.search;
	if(search){
		db.query("SELECT * FROM people WHERE login = '" + search + "'", function(error, results, fields) {
			console.log(results);
			console.log(results.length);
			if(results.length > 0){
				console.log(req.params)
				res.render("search" + "?" + search, {results: results});
			}
			else{
				res.render("search" + "?" + search, {results: null});
			}
		});
	}
});	
module.exports = router;


