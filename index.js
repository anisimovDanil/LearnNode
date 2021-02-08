const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session'); 


const app = express();

let connection = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'study',
	insecureAuth : true
});

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.post('/', urlencodedParser, function(req, res) { 
	var login = req.body.login;
	var password = req.body.password;
	if (login && password) {
		connection.query('SELECT * FROM people WHERE login = ? AND password = ?', [login, password], function(error, results, fields) {

			if (error) throw error;
			else{
				if (results.length > 0) {
					//req.session.loggedin = true;
					//req.session.login = login;
					res.end('Helo')
					///res.redirect('/home');
				} else {
					res.send('Incorrect Username and/or Password!');
				}			
				res.end();
			}
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});


app.listen(3000, function() {
    console.log('Server is running on port 3000...');
});