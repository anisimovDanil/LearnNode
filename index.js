const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
//const jwt = require('jsonwebtoken');
const session = require('express-session'); 


const app = express();
const tokenKey = '1a2b-3c4d-5e6f-7g8h'

// mysql.createConnection
let connection = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'study',
	insecureAuth : true
});

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('view engine', 'ejs');




app.get('/log_in', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/admin', function(req, res){
	res.sendFile(__dirname + '/admin/admin.html');
});

app.get('/user', function(req, res){
	res.sendFile(__dirname + '/user/user.html');
});




app.use(connect.cookieParser());

app.use(connect.session({ secret: 'your secret here'} ));

/*app.use((req, res, next) => {
 if(req.headers.authorization){
   jwt.verify(req.headers.authorization.split(' ')[1], tokenKey, (err, payload) => {
     if(err)
       next();
     else if(payload){
       for(let user of users){
         if(user.id === payload.id){
           req.user = user;
           next();
         }
       }

       if(!req.user) next();
     }
   });
 }

 next();
});*/



app.post('/', urlencodedParser, function(req, res) { 
	var login = req.body.login;
	var password = req.body.password;
	if (login && password) {
		//connection.connect(
		//connection.query('SELECT * FROM people WHERE login = ? AND password = ?', [login, password], function(error, results, fields) { // protection
		connection.query("SELECT * FROM people WHERE login = '" + login + "' AND password = '" + password + "'", function(error, results, fields) {
			if (error) throw error;
			else{
				if(results[0].password && results[0].role === 'user'){
					//res.redirect('/user');


					//JWT 
					/*return res.status(200).json({
			           id: results[0].id,
			           login: results[0].login,
			           token: jwt.sign({id: results[0].id}, tokenKey)
			         });*/

					req.session.authorized = true;
					req.session.username = login;
					
				}

				if(results[0].password && results[0].role === 'admin'){
					res.redirect('/admin');
				}
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

//sql
// '; OR 1=1'