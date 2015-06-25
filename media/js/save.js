$(function() {

	var socket = io();

	var text1 = '';

	setInterval(function() {

		var text2 = $('#notepad').val();
		if (text1 != text2) {
			text1 = text2;
			socket.emit('update-text', {
				'text' : text1
			});
		}
			
	}, 1);

	socket.on('update-text', function(data) {
		$('#notepad').val(data);
	});

});