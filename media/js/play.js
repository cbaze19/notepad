$(function() {

	var socket = io();

	$('.square').on('click', function() {
		if ($(this).text() == '') {
			socket.emit('play', $(this).attr('id'));
		}
		
	});

	socket.on('play', function(play) {
		var object = $('#'+play)
		object.html('O');
	})

});