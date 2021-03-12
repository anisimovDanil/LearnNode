const express = require('express'),
	  bodyParser = require('body-parser'),
	  mysql = require('mysql'),
	  session = require('express-session'), 
	  cookieParser = require('cookie-parser'),
	  path = require('path');

const db = require('./connect_db/connect.js');
	  route_search = require('./search/search.js');


const app = express();

app.set('view engine', 'ejs'); 

// mysql.createConnection
// mysql.createPool

app.use(route_search);

app.use(session({
	secret: 'goose_duck',
	resave: false,
	saveUninitialized: false
	/*cookie: {
	    expires: 600
	}*/
}));

const urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(cookieParser("goose_cookie_key"));


app.get('/log_out', (req, res, next) => {
	delete req.session.login;
	res.clearCookie('signed_cookie');
	res.send('cookie deleted');
});

app.get('/log_in', (req, res, next) => {
	res.sendFile(path.join(__dirname + '/index.html')); // (1)
});

app.get('/user', function(req, res, next){
	//res.cookie('signed_cookie', 'user', {signed:true});
	if(req.session.loggedin) res.sendFile(__dirname + '/user/user.html');
	else
		res.send('Please input your login and password');
});

app.get('/admin', (req, res, next) => {
	//res.sendFile(__dirname + '/admin/admin.html');
	res.render('admin/admin.ejs');
});


app.post('/', urlencodedParser, (req, res, next) => { 
	var login = req.body.login;
	var password = req.body.password;
	if (login && password) {
		//db.connect(
		//db.query('SELECT * FROM people WHERE login = ? AND password = ?', [login, password], function(error, results, fields) { // protection
		db.query("SELECT * FROM people WHERE login = '" + login + "' AND password = '" + password + "'", function(error, results, fields) {
				if(results[0].password && results[0].role === 'user'){//&& req.signedCookies.signed_cookie == 'user'
					req.session.loggedin = true;
					req.session.login = login;
					console.log(req.session);
					/*res.send(`
						<h1>Hello, ${results[0].login}</h1>
						<a href="/log_out">logout</a>
					`);*/
					res.redirect('/user');
				}

				if(results[0].password && results[0].role === 'admin'){
					//res.redirect('/admin');	//	TypeError: Cannot read property 'password' of undefined
					res.render('admin/admin.ejs');
				}
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});


app.listen(3000, () => {
    console.log('Server is running on port 3000...');
});

//sql (log_in)
// ' OR 1=1 #'

//sql (search)
// a' OR id = '2' #'
// a' OR login = 'admin' #'
// a' UNION SELECT * FROM people;#'

//password 
//  ' OR password>'a