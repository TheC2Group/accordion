import babel from 'rollup-plugin-babel';

export default {
    entry: 'accordion.js',
    dest: 'cjs/accordion.js',
    format: 'cjs',
    plugins: [ babel() ]
};
