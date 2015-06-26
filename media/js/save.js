$(function() {

	var socket = io();

	var test = false;

	setInterval(function() {

		if (test)
		{
			var text = $('#notepad').val();
			socket.emit('update-text', {
				'text' : text,
				'sender' : socket.id
			});
			test = false;
		}

	}, 100);

	$('#notepad').keydown(function() {
		test = true;
	});

	socket.on('update-text', function(data) {
		if (data.sender != socket.id) {
			$('#notepad').val(data.text);
			console.log(data.sender + '------' + socket.id);
		} else {
			console.log(data.sender + '------' + socket.id);
		}
	});

	var http = require('http');
	setInterval(function() {
		http.get('http://bazenotes.herokuapp.com');
	}, 300000);

});