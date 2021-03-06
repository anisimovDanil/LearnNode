const express = require('express'),
	  bodyParser = require('body-parser');

const db = require('./../connect_db/connect.js');
const router = express.Router();


router.set('view engine', 'ejs');

const urlencodedParser = bodyParser.urlencoded({extended: false});




router.get('/search', (req, res, next) => {
	//res.sendFile(__dirname + './../views/search.ejs');
	res.render('search.ejs')
});

router.post('/search', urlencodedParser, (req, res, next) => {
	let search = req.body.search;
	if(search){
		db.query("SELECT * FROM people WHERE login = '" + search + "'", function(error, results, fields) {
			if(results.length > 0){
				req.body.output = "";
				for(let i in results){
					res.write("<p>" + results[i].login + "</p>");
					//res.json(results[i].id + " | " + results[i].login + " | " + results[i].password + " | " + results[i].role);
				}
			}
		});
	}
});	
module.exports = router;
