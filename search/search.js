const express = require('express'),
	  bodyParser = require('body-parser');

const db = require('./../connect_db/connect.js');
const router = express.Router();
//<p><%= results[i].id + " | " + results[i].login + " | " + results[i].password + " | " + results[i].role %></p>
//	<%} %>

//router.set('view engine', 'ejs');

const urlencodedParser = bodyParser.urlencoded({extended: false});




router.get('/search', (req, res, next) => {
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
			    
				res.render("search.ejs", {results: results});
			  
				
				/*for(let i in results){
					//res.write("<p>" + results[i].login + "</p>");
					//res.json(results[i].id + " | " + results[i].login + " | " + results[i].password + " | " + results[i].role);
				}*/
			}
			else{
				res.render("search.ejs", {results: null});
			}
		});
	}
});	
module.exports = router;


