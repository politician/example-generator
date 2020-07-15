/**
 * Include the example generator dependency
 */
import { formats } from 'example-generator/dist/esm/index.js'

// You can also import from a specific file from your library
import { exampleGenerator } from 'example-generator/dist/esm/exampleGenerator.js'

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
