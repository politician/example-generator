
import { DEFAULT_EXTENSIONS } from '@babel/core'
import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import externals from 'rollup-plugin-node-externals'
import glob from 'glob'


import resolve from '@rollup/plugin-node-resolve'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'





// Recognized file extensions
const extensions = [...DEFAULT_EXTENSIONS, '.ts', '.tsx']

// Size snapshot path (to track the size of your bundles)
const snapshotPath = '.config/.size-snapshot.json'

// Generate source maps only for development
const sourcemap = process.env.BUILD === 'production' ? false : true



// Babel configuration (extends babel.config.js)
const babelConfig = {
  babelHelpers: 'runtime',
  extensions,
  plugins: ['@babel/plugin-transform-runtime'],
}

// This config marks all the dependencies in package.json as externals.
// It can be tweaked to bundle some dependencies but if you do so,
// please only bundle small dependencies that are not updated often
const externalsConfig = {
  packagePath: 'package.json',
  builtins: true,
  deps: true,
  devDeps: true,
  peerDeps: true,
  optDeps: true,
  exclude: [], // Add here the small dependencies you want to bundle
}

// Convert Babel directory imports to file imports for native Node ES6 support
// Needed until babel adds extensions itself https://github.com/babel/babel/pull/10853
const aliasConfig = {
  entries: [
    {
      find: '@babel/runtime/regenerator',
      replacement: '@babel/runtime/regenerator/index.js',
    },
    {
      find: /(@babel\/runtime\/helpers\/.*(?<!\.js)$)/i,
      replacement: '$1.js',
    },
    { find: /(core-js\/modules\/.*(?<!\.js)$)/i, replacement: '$1.js' },
  ],
}


export default [
  // ES6 & CJS modules
  {
    input: glob.sync('src/**/*.[jt]s?(x)'),
    output: [
      // ES6 modules (to be consumed via import)
      {
        dir: 'dist/esm',
        format: 'esm',
        sourcemap,
      },
      // CommonJS modules (to be consumed by require)
      {
        dir: 'dist/cjs',
        format: 'cjs',
        sourcemap,
      },
    ],
    plugins: [
      alias(aliasConfig),
      externals(externalsConfig),
      resolve({ extensions }),
      commonjs(),
      babel(babelConfig),
      sizeSnapshot({ snapshotPath }),
    ],
  },

  ]
