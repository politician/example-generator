/**
 * Include the example generator dependency
 */
const { exampleGenerator } = require('../dist/cjs')

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
