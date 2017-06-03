var qunit = require('node-qunit-phantomjs');

qunit('./test/test.html', {
  customRunner: './test/runner.js',
  page: {coverageLocation: './coverage/coverage.json'}
});
