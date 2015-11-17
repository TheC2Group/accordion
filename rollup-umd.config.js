import babel from 'rollup-plugin-babel';

const pjson = require('./package.json');

const banner = `/*!
 * ${pjson.name}
 * ${pjson.repository.url}
 * @version ${pjson.version}
 * @license ${pjson.license}
 */`;

export default {
    entry: 'accordion.js',
    dest: 'umd/accordion.js',
    format: 'umd',
    plugins: [
        babel()
    ],
    moduleName: 'Accordion',
    banner,
    globals: {
        jquery: 'jQuery'
    }
};
