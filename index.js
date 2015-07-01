var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var https = require('http');
var mysql = require('mysql');

var port = process.env.PORT || 8080;

app.use('/media', express.static(__dirname + '/media'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

var text = '';

io.sockets.on('connection', function(socket) {

	dbUpdate();

	io.emit('update-text', {'text' : text, 'sender' : 'server'});

	var clientIp = socket.request.connection.remoteAddress;
	console.log('User connected from ' + clientIp);

	socket.on('update-text', function(data) {
		io.emit('update-text', data);
		text = data.text;
	});

});

http.listen(port, function() {
	console.log('listening on ' + port);
});

setInterval(function() {
	console.log(text);
	dbUpdate2();
}, 30000);

var pool = mysql.createPool({
connectionLimit : 100,
host : 'us-cdbr-iron-east-02.cleardb.net',
user : 'b0c64e1ee263dc',
password : 'a09d660c',
database : 'heroku_fe38a581b5c4637',
debug : false
});

function dbUpdate() {

	pool.getConnection(function(err, connection) {
	if (err) {
		connection.release();
		return;
	}
	connection.query('select * from texts', function(err, rows) {

		connection.release();
		
		if(!err) {
			text = rows[0].Text;
			console.log(rows[0].Text);
		}

	});
	connection.on('error', function(err) {      
	              console.log('Error in dbUpdate connection...');
	              return;     
	        });
	})
}

function dbUpdate2() {
	pool.getConnection(function(err, connection) {
	if (err) {
		console.log('Error!');
		connection.release();
		return;
	}
	console.log('running query...');

	connection.query('update texts set Text = "' + text + '" where text_id = 1', function(err, results) {
		connection.release();

		if (!err) {
			console.log('SUCCESS!');
		}
	});

	// connection.query("update texts set Text = " + text + " where text_id = 1", function(err, rows) {
	// 	console.log('query ran...');
	// 	connection.release();
	
	// 	if(!err) {
	// 		console.log('Text Updated!');
	// 	}

	// });

	connection.on('error', function(err) {      
	              console.log('Error in dbUpdate2 connection...');
	              return;     
	        });
	})
}
