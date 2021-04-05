const express = require('express'),
	  bodyParser = require('body-parser'),
	  mysql = require('mysql'),
	  session = require('express-session'), 
	  cookieParser = require('cookie-parser'),
	  path = require('path');

const db = require('./connect_db/connect.js'),
	  route_search = require('./search/search.js'),
	  reviews = require('./reviews/reviews.js'); // change


const app = express();

app.set('view engine', 'ejs'); 

// mysql.createConnection
// mysql.createPool


app.use(route_search);
app.use(reviews);
app.use(express.static('public'));


app.use(session({
	key: 'session',
    secret: '3dCE84rey8R8pHKrVRedgyEjhrqGT5Hz',
	resave: true,
	saveUninitialized: true,
	cookie: {
	    maxAge: null
	}
}));

const urlencodedParser = bodyParser.urlencoded({extended: true});
app.use(bodyParser.json());
app.use(cookieParser("goose_cookie_key")); // ключ для "подписанных" cookie-файлов



app.get('/log_out', (req, res, next) => {
	req.session.destroy((err) => {
		if(err) return err;
		else{
			res.clearCookie('auth_signed_cookie');
			res.redirect('/log_in');
		}
	});
});

app.get('/log_in', (req, res, next) => {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/id=:id', function(req, res, next){
	if(req.session.loggedin && req.session.login && req.session.role === "user") { 
		res.send(`
			<h1>Hello, ${req.session.login}</h1>
			<a href="/log_out">EXIT</a>
			<p>Score: ${req.session.score}</p>
		`);
	}
	else if(req.session.loggedin && req.session.login && req.session.role === "admin") {
		//console.log(req.params); req.params - указывает id авторизировавшего пользователя
		//console.log(req.headers);
		console.log(req.body);
		console.log(req.session); 
		res.send(`
			<h1>Welcome creator - ${req.session.login}</h1>
			<a href="/log_out">EXIT</a>
		`);
		//res.sendFile(__dirname + '/user/user.html');
	}
	else
		res.send(`
			<h1>Please input your login and password</h1>
			<a href="/log_in">LOG IN</a>
		`);
});

/*app.get('/admin', (req, res, next) => {
	//res.sendFile(__dirname + '/admin/admin.html');
	res.render('admin/admin.ejs');
});*/



app.post('/', urlencodedParser, (req, res, next) => { 
	//if (req_body.length > 1e6) req.connection.destroy(); // защита от ddos - НЕПОЛНАЯ
	if (req.body.login && req.body.password) {
		//db.connect(
		//db.query('SELECT * FROM people WHERE login = ? AND password = ?', [login, password], function(error, results, fields) { // protection
		db.query("SELECT * FROM people WHERE login = '" + req.body.login + "' AND password = '" + req.body.password + "'", function(error, results, fields) {
			if(results.length > 0){
				let {id, login, password, role} = results[0];

				if(login && password && role === 'user'){

					res.cookie('auth_signed_cookie', id + login + password, {
						httpOnly: false,
						signed: true
					});
					
					req.session.loggedin = true;
					req.session.login = results[0].login;
					req.session.role = results[0].role;

					//res.redirect('/user');
					res.redirect("/id=" + id);
				}
				else if(results[0].login && results[0].password && results[0].role === 'admin'){
					//res.redirect('/admin');	//	TypeError: Cannot read property 'password' of undefined
					//res.render('admin/admin.ejs');

					res.cookie('auth_signed_cookie', id + login + password, {
						httpOnly: false,
						signed:true
					});

					login, password = req.session;
					req.session.loggedin = true;

					res.redirect("/id=" + results[0].id, req.session);
				}
			}
			else{
				res.send(`
					<h1>You are not registered, register here:</h1>
					<a href="#">Registration</a>
				`);					
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

//xss
// ggg" onerror="alert(123)" - пассивная(запасной вариант)
// + 
// goose_cookie: auth_signed_cookie | s%3Agoose123.0po3sDqK7tdOeNW3VcjQChH2Qs%2BRtlNxVqWz4gXGsCg
//  duck_cookie: 



// xss
//#1 - <script>alert()</script> в URL
//#2 - <img src="/img/javascript:alert()" onerror='javascrip:alert().jpg' "> ввод в форму, где был html
//#3 - 
//#4 - 
//#5 - 
//#6 - 