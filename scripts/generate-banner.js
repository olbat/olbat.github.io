var Trianglify = require('trianglify');
var t = Trianglify({
	width: (process.argv.length >= 3 ? parseInt(process.argv[2]) : 1600),
	height: (process.argv.length >= 4 ? parseInt(process.argv[3]) : 300),
	cell_size: 50,
	variance: 0.75,
	x_colors: 'random',
	seed: (process.argv.length >= 5 ? parseInt(process.argv[4]) : 0),
});
process.stdout.write(t.svg().outerHTML)
