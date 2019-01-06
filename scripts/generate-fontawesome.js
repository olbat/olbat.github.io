/*
 * Generates a stripped and minified version of Font Awesome 5 (JS+SVG)
 * (see https://github.com/FortAwesome/Font-Awesome)
 */
var https = require('https');
var FAMinify = require('fa-minify');
var UglifyJS = require("uglify-js");

const faVers = process.argv[2];
const usedIcons = {
  fal: [],
  far: [],
  fas: [
    'map-marker-alt',
    'envelope-square',
    'university',
    'file-alt',
    'key',
    'at',
  ],
  fab: [
    'github',
    'linkedin',
  ],
};
const faCopyright = `/*!
 * Font Awesome Free ${faVers} by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */`;


// fetch FA from main repository
var req = {
  method: 'GET',
  host: 'raw.githubusercontent.com',
  port: 443,
  path: `/FortAwesome/Font-Awesome/${faVers}/js/all.js`,
};
https.request(req, function (res) {
  if (res.statusCode == 200)  {
    res.setEncoding('utf8');

    var body = '';
    res.on('data', function (chunk) { body = body + chunk; });

    res.on('end', function () {
      // strip FA: only keep used icons
      var fajs = FAMinify.removeUnusedIcons(body, { usedIcons });

      // minify the stripped FA code
      fajs = UglifyJS.minify(fajs);

      // print minified FA to stdout
      process.stdout.write(faCopyright);
      process.stdout.write(fajs.code);
    });
  } else {
    process.stderr.write("Cannot fetch FA (HTTP err #" + res.statusCode + ")");
    process.exit(1);
  }
}).end();
