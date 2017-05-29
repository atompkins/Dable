import istanbul from 'rollup-plugin-istanbul';
// import {readFileSync} from 'fs';

// var pkg = JSON.parse(readFileSync('bower.json', 'utf-8'));
const bwr = require('./bower.json');
const banner = '/*! ' + bwr.name + ' v' + bwr.version +
  ' (' + bwr.homepage + ') */';

let plugins = [];
let dest = 'lib/dable.js';

if (process.env.BUILD === 'test') {
  plugins.push(istanbul({include: ['src/**/*.js']}));
  dest = 'coverage/dable.test.js';
}

export default {
  banner: banner,
  entry: 'src/dable.js',
  legacy: true,
  moduleId: 'Dable',
  moduleName: 'Dable',
  plugins: plugins,
  targets: [
    {dest: dest, format: 'umd'}
  ]
};
