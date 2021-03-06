const express = require('express'),
	  bodyParser = require('body-parser'),
	  mysql = require('mysql'),
	  session = require('express-session'), 
	  cookieParser = require('cookie-parser');

const db = require('./connect_db/connect.js');
	  //route_search = require('./search/search.js');


const app = express();

app.set('view engine', 'ejs'); 

// mysql.createConnection
// mysql.createPool

app.use(cookieParser("cookie signature key"));

//app.use(route_search);
const urlencodedParser = bodyParser.urlencoded({extended: false});


/*app.use(session({
  secret: 'goose_duck',
  resave: false,
  saveUninitialized: true,
  cookie: {},
  name: 'myCustomName'
}));*/



app.get('/cookie/delete', (req, res, next) => {
	res.clearCookie('signed_cookie');
	res.send('cookie deleted');
});

app.get('/log_in', (req, res, next) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/admin', (req, res, next) => {
	//res.sendFile(__dirname + '/admin/admin.ejs');
	res.render('admin/admin.ejs');
});




app.post('/', urlencodedParser, (req, res, next) => { 
	var login = req.body.login;
	var password = req.body.password;
	if (login && password) {
		//connection.connect(
		//connection.query('SELECT * FROM people WHERE login = ? AND password = ?', [login, password], function(error, results, fields) { // protection
		db.query("SELECT * FROM people WHERE login = '" + login + "' AND password = '" + password + "'", function(error, results, fields) {
				res.cookie('signed_cookie', 'user', {signed:true});

				app.get('/user', function(req, res, next){
						console.log('5 ' + req.headers.cookie);
						res.sendFile(__dirname + '/user/user.html');
						console.log('6 ' + req.signedCookies.signed_cookie);
					});


				if(results[0].password && results[0].role === 'user'){//&& req.signedCookies.signed_cookie == 'user'

					
					res.redirect('/user');
				/*f(req.headers.cookie == undefined) {
					console.log('1 ' + req.headers.cookie);
					res.cookie('signed_cookie', 'user', {signed:true});
					console.log('2 ' + req.headers.cookie);
					next();
				}
				else{
					res.cookie('signed_cookie', 'user', {signed:true});
					console.log('4 ' + req.headers.cookie);
					res.redirect('/user');	
				}		*/			
				}





				if(results[0].password && results[0].role === 'admin'){
					res.redirect('/admin');
				}
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

/*app.post('/user', urlencodedParser, function(req, res, next) { 
	if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            } else {
                req.session = null;
                console.log("logout successful");
                return res.redirect('/');
            }
        });
    } 
});*/



app.listen(3000, () => {
    console.log('Server is running on port 3000...');
});

//sql
// '; OR 1=1'