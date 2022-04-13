import extension from 'rollup-plugin-gsext'

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
