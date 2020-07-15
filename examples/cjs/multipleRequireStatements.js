/**
 * Include the example generator dependency
 */
const { formats } = require('example-generator')

// You can also import from a specific file from your library
const { exampleGenerator } = require('example-generator/dist/cjs/exampleGenerator.js')

/**
 * Use the example generator
 */

// Initialize object
const examples = new exampleGenerator()

// Generate examples
examples.generate({
  exportName: 'myPackage',
  sources: [
    'examplesSrc/basicExample.js',
    'examplesSrc/basicExample.cjs.js',
    'examplesSrc/advancedExample.js',
  ],
})
