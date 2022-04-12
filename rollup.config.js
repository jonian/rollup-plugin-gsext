import pkg from './package.json'

export default {
  input: 'src/index.js',
  external: ['fs', 'path', 'child_process'],
  output: [
    { file: pkg.main, format: 'cjs', exports: 'auto' },
    { file: pkg.module, format: 'es' }
  ]
}
