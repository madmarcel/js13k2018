/*
export default {
    entry: 'src/index.js',
    dest: 'dist/game.js',
    format: 'iife',
    sourceMap: 'inline'
};
*/

module.exports = {
    input: 'src/index.js',
    output: {
      file: 'dist/game.js',
      format: 'iife'
    }
};