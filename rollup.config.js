import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import scss from 'rollup-plugin-scss'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import fileAsBlob from 'rollup-plugin-file-as-blob'

export default {
  external: ['react', 'react-dom', 'lodash', 'axios', 'pressure', 'konva'],
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    lodash: '_',
    axios: 'axios',
    pressure: 'Pressure',
    konva: 'Konva',
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
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: [
        ['@babel/plugin-proposal-export-namespace-from'],
        ['@babel/plugin-proposal-export-default-from'],
        ['@babel/plugin-transform-react-jsx'],
        [
          '@babel/plugin-proposal-decorators',
          { decoratorsBeforeExport: false },
        ],
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
    fileAsBlob({
      include: ['**/**.png', '**/**.mp3'],
    }),

    serve({ contentBase: 'public', host: '192.168.1.3', port: 10001 }),
    livereload({ watch: 'public' }),
  ],
}
