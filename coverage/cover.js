var qunit = require('node-qunit-phantomjs');

qunit('./coverage/cover.html', {
  customRunner: './coverage/runner.js',
  page: {coverageLocation: './coverage/coverage.json'}
});
