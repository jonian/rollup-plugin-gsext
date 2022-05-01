import pkg from './package.json'

export default {
  input: 'src/index.js',
  external: ['fs', 'child_process', 'xml-js'],
  output: [
    { file: pkg.main, format: 'cjs', exports: 'auto' },
    { file: pkg.module, format: 'es' }
  ]
}
