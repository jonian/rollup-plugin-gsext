import extension from '../src/index.js'

export default {
  input: ['src/metadata.json', 'src/module.js'],
  output: {
    dir: 'dist',
    format: 'esm'
  },
  plugins: [
    extension()
  ]
}
