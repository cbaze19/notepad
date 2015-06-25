$(function() {

	var socket = io();

	var map = []; // Or you could call it "key"
	onkeydown = onkeyup = function(e){
	    e = e || event; // to deal with IE
	    map[e.keyCode] = e.type == 'keydown';
	    if(map[17] && map[16] && map[83]){ // CTRL+SHIFT+A
    		var text = $('#notepad').val();
            socket.emit('update-text', {
				'text' : text
			});
            alert('Text Saved!');
            map = [];
    	}
	}

	socket.on('update-text', function(data) {
		$('#notepad').val(data);
	});

});