/**
 * Base Babel config
 * Jest's Babel config uses solely the config in the current file
 * Rollup's Babel config (located in rollup.config.js) extends the current file to generate:
 * - ES6/CJS modules using runtime helpers
 */

const config = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
  ],
  ignore: ['node_modules/**'],
}

module.exports = (api) => {
  // Need to specify runtime helpers for Jest as it uses modules that didn't go through rollup
  if (api.env('test')) config.plugins.push('@babel/plugin-transform-runtime')
  return config
}
