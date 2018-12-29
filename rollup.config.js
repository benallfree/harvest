import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import scss from 'rollup-plugin-scss'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace';

export default {
  external: ['react', 'react-dom', 'lodash', 'axios', 'pressure'],
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    lodash: '_',
    axios: 'axios',
    pressure: 'Pressure',
  },
  input: 'src/app.js',
  output: {
    file: 'public/app.js',
    format: 'iife',
    name: 'flowEngine',
  },
  plugins: [
    replace({
      ENVIRONMENT: JSON.stringify('development'),
      'process.env': JSON.stringify({NODE_ENV: 'development'})
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: [
        ['@babel/plugin-transform-react-jsx'],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
    }),
    scss({
      output: 'public/app.css',
    }),
    resolve(),
    commonjs({
      namedExports: {
        'node_modules/react-pressure/build.index.js': ['Pressure'],
        'node_modules/react-konva/lib/ReactKonva.js': [
          'Layer',
          'FastLayer',
          'Group',
          'Label',
          'Rect',
          'Circle',
          'Ellipse',
          'Wedge',
          'Line',
          'Sprite',
          'Image',
          'Text',
          'TextPath',
          'Star',
          'Ring',
          'Arc',
          'Tag',
          'Path',
          'RegularPolygon',
          'Arrow',
          'Shape',
          'Transformer',
          'Stage',
          'useStrictMode',
        ],
      },
    }),
    serve({ contentBase: 'public', host: '192.168.1.3', port: 10001 }),
    livereload({ watch: 'public' }),
  ],
}
