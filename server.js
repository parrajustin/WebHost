var UglifyJS = require('uglify-js');
var fs = require('fs');
// var browserify = require('browserify')
//   , envify = require('envify/custom');

// var b = browserify('main.js')
//   , output = fs.createWriteStream('bundle.js')

// b.transform(envify({
//   NODE_ENV: 'development'
// }))
// b.bundle().pipe(output)
var jsbundle = UglifyJS.minify('./public/bundle.js', {
	mangle: true,
	compress: {
		sequences: true,
		dead_code: true,
		conditionals: true,
		booleans: true,
		unused: true,
		if_return: true,
		join_vars: true,
		drop_console: true
	}
});
fs.writeFileSync('./public/bundle.js', jsbundle.code);