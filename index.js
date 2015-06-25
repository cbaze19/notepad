var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 8080;

app.use('/media', express.static(__dirname + '/media'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

var text = '';

io.sockets.on('connection', function(socket) {

	io.emit('update-text', text);

	var clientIp = socket.request.connection.remoteAddress;
	console.log('User connected from ' + clientIp);

	socket.on('update-text', function(data) {
		io.emit('update-text', data.text);
		text = data.text;
	});

});

http.listen(port, function() {
	console.log('listening on ' + port);
});