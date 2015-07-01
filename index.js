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
	https.get('http://bazenotes.herokuapp.com');
}, 300000);

var pool = mysql.createPool({
connectionLimit : 100,
host : 'us-cdbr-iron-east-02.cleardb.net',
user : 'b0c64e1ee263dc',
password : 'a09d660c',
database : 'heroku_fe38a581b5c4637',
debug : false
});

function dbUpdate()
{
	pool.getConnection(function(err, connection) {
	if (err) {
	connection.release();
	return;
	}
	connection.query('select * from texts', function(err, rows) {
	connection.release();
	console.log(rows);
	if(!err) {
	console.log('Error!!!');
	}
	});
	connection.on('error', function(err) {      
	              res.json({"code" : 100, "status" : "Error in connection database"});
	              return;     
	        });
	})
}