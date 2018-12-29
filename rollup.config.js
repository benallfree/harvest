import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import scss from 'rollup-plugin-scss'

export default {
  external: ['react', 'react-dom', 'lodash', 'axios', 'pressure'],
  globals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'lodash': '_',
    'axios': 'axios',
    'pressure': 'Pressure'
  },
  input: 'src/app.js',
  output: {
    file: 'public/app.js',
    format: 'iife',
    name: 'flowEngine'
  },
  plugins: [
    scss({
      output: 'public/app.css'
    }),
    buble({
      objectAssign: 'Object.assign'
    }),
    resolve(),
    commonjs({
      namedExports: {
        'node_modules/react-pressure/build.index.js': [ 'Pressure' ]
      }
    }),
    serve({ contentBase: 'public', host: '192.168.1.3', port: 10001 }),
    livereload({ watch: 'public' })
  ]
}
