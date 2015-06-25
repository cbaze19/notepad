$(function() {

	var socket = io();

	var keys = {17: false, 16: false, 83: false};

	$('#notepad').keydown(function(e) {
	    if (e.keyCode in keys) {
	        keys[e.keyCode] = true;
	        if (keys[17] && keys[16] && keys[83]) {
	        	var text = $('#notepad').val();
	            socket.emit('update-text', {
					'text' : text
				});
	            alert('Text Saved!');
	        }
	    }
	}).keyup(function(e) {
	    if (e.keyCode in keys) {
	        keys[e.keyCode] = false;
	    }
	});

	socket.on('update-text', function(data) {
		$('#notepad').val(data);
	});

});