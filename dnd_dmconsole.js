$(document).ready(function() {
	$('.dice').on('click', function(){
		var roll = parseInt($(this).data("maxval"))
		if (roll == 0) {
			roll = parseInt($('#custom_dice').val());
			if (isNaN(roll) || roll < 1) {
				alert("Please use a valid custom dice.");
				return;
			}
		}
		var roll = Math.floor(Math.random()*roll) + 1;
		var result_box = $(this).closest('.dice_block').find('.dice_roll');
		result_box.text('Rolling...');
		setTimeout(function(){result_box.text(roll);}, 200);
	});

	var dropZone = document.getElementById('drop_zone');
	dropZone.addEventListener('dragover', handleDragOver, false);
	dropZone.addEventListener('drop', handleFileSelect, false);

});

function handleFileSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	var files = evt.dataTransfer.files; // FileList object.

	// files is a FileList of File objects. List some properties.
	var output = [];
	for (var i = 0, f; f = files[i]; i++) {
		output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
					f.size, ' bytes, last modified: ',
					f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
					'</li>');
	}
	var reader = new FileReader();

	reader.onload = function(e) {
		var text = reader.result;
		//######################################################################
		document.getElementById('profiles').innerHTML = read_profile(text);
		//alert(read_profile(text));
		//######################################################################
	}

	reader.readAsText(files[0]);
	document.getElementById('drop_zone').innerHTML = '<ul id="drop_zone_list">' + output.join('') + '</ul>';
	
}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function read_profile(setstr) {
	var horde = JSON.parse(setstr);
	var count = Object.keys(horde).length;
	var output = "";
	for (var monster in horde) {
		var stats = "";
		for (var attr in horde[monster]) {
			stats += "\n<li>"+attr+": "+horde[monster][attr]+"</li>";
		}
		horde[monster]["name"] = monster;
		output += "\n<li>"+horde[monster].name+"\n<ul>"+stats+"\n</ul>\n</li>";		
	}
	output = "\n<ul>"+output+"\n</ul>";
	return output;
}

function computeRoll (s, m, n, f, a) {
    m = parseInt( m );
    if( isNaN( m ) ) m = 1;
    n = parseInt( n );
    if( isNaN( n ) ) n = 1;
    f = parseInt( f );
    a = typeof(a) == 'string' ? parseInt( a.replace(/\s/g, '') ) : 0;
    if( isNaN( a ) ) a = 0;
    var r = 0;
    for( var i=0; i<n; i++ )
    	r += Math.floor( Math.random() * f );
    return r * m + a;
};
function parseDice( d ) {
    return computeRoll.apply( this, d.match(/(?:(\d+)\s*\*\s*)?(\d*)d(\d+)(?:\s*([\+\-]\s*\d+))?/i) );
}