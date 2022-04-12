import extension from 'rollup-plugin-gsext'

export default {
  input: 'src/metadata.json',
  output: {
    dir: 'dist',
    format: 'esm'
  },
  plugins: [
    extension()
  ]
}
