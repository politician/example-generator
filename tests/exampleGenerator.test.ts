import { exampleGenerator, formats } from '../src'
import { existsSync, readFileSync, rmdirSync } from 'fs'
import { format } from 'util'
import path from 'path'

const examples = new exampleGenerator()

/**
 * Expected outputs
 */
const basicJsBody = `/**
 * Include the example generator dependency
 */
%s

/**
 * Use the example generator
 */

// Initialize object
const examples = new %sexampleGenerator()

// Generate examples
examples.generate({
  exportName: 'myPackage',
  sources: [
    'examplesSrc/basicExample.js',
    'examplesSrc/basicExample.cjs.js',
    'examplesSrc/advancedExample.js',
  ],
})`

const basicTitle = 'Basic example'
const basicMdBody = `# Using %s

## Basic example

Include the example generator dependency

\`\`\`js
%s
\`\`\`

Use the example generator

\`\`\`js
// Initialize object
const examples = new %sexampleGenerator()

// Generate examples
examples.generate({
  exportName: 'myPackage',
  sources: [
    'examplesSrc/basicExample.js',
    'examplesSrc/basicExample.cjs.js',
    'examplesSrc/advancedExample.js',
  ],
})
\`\`\`
`

const basicJs = {
  cjs: format(
    basicJsBody,
    "const myPackage = require('example-generator')",
    'myPackage.'
  ),
  esm: format(
    basicJsBody,
    "import { exampleGenerator } from 'example-generator'",
    ''
  ),
  nodeEsm: format(
    basicJsBody,
    "import { exampleGenerator } from 'example-generator/dist/esm/index.js'",
    ''
  ),
  iife: format(
    `
<!--
Include the example generator dependency
 -->

<script src="https://unpkg.com/example-generator@^%s"></script>

<!--
Use the example generator
 -->
<script type="text/javascript">

// Initialize object
const examples = new myPackage.exampleGenerator()

// Generate examples
examples.generate({
  exportName: 'myPackage',
  sources: [
    'examplesSrc/basicExample.js',
    'examplesSrc/basicExample.cjs.js',
    'examplesSrc/advancedExample.js',
  ],
})

</script>`,
    examples.pkg.version
  ),
}

const basicMd = {
  cjs: format(
    basicMdBody,
    'CommonJS modules',
    "const myPackage = require('example-generator')",
    'myPackage.'
  ),
  esm: format(
    basicMdBody,
    'ES modules',
    "import { exampleGenerator } from 'example-generator'",
    ''
  ),
  nodeEsm: format(
    basicMdBody,
    'native ES Modules in Node.js (12+)',
    "import { exampleGenerator } from 'example-generator/dist/esm/index.js'",
    ''
  ),
  iife: `# Using natively in the browser

## Basic example

Include the example generator dependency

\`\`\`html
<script src="https://unpkg.com/example-generator@^0.0.0"></script>
\`\`\`

Use the example generator

\`\`\`html
<script type="text/javascript">

// Initialize object
const examples = new myPackage.exampleGenerator()

// Generate examples
examples.generate({
  exportName: 'myPackage',
  sources: [
    'examplesSrc/basicExample.js',
    'examplesSrc/basicExample.cjs.js',
    'examplesSrc/advancedExample.js',
  ],
})

</script>
\`\`\`
`,
}

const predefinedJs = basicJs

const predefinedTitle = 'Predefined output'
const predefinedMd = {
  cjs: basicMd.cjs.replace(basicTitle, predefinedTitle),
  esm: basicMd.esm.replace(basicTitle, predefinedTitle),
  iife: basicMd.iife.replace(basicTitle, predefinedTitle),
  nodeEsm: basicMd.nodeEsm.replace(basicTitle, predefinedTitle),
}

const multipleJs = {
  cjs: basicJs.cjs
    .replace(
      `const myPackage = require('example-generator')`,
      `const { formats } = require('example-generator')

// You can also import from a specific file from your library
const { exampleGenerator } = require('example-generator/dist/cjs/exampleGenerator.js')`
    )
    .replace('myPackage.exampleGenerator()', 'exampleGenerator()'),
  esm: basicJs.esm.replace(
    `import { exampleGenerator } from 'example-generator'`,
    `import { formats } from 'example-generator'

// You can also import from a specific file from your library
import { exampleGenerator } from 'example-generator/dist/esm/exampleGenerator.js'`
  ),
  iife: basicJs.iife.replace(
    `<script src="https://unpkg.com/example-generator@^${examples.pkg.version}"></script>`,
    `<script src="https://unpkg.com/example-generator@^${examples.pkg.version}"></script>

<!-- You can also import from a specific file from your library -->
<script src="https://unpkg.com/example-generator@^${examples.pkg.version}/dist/iife/exampleGenerator.js"></script>`
  ),
  nodeEsm: basicJs.nodeEsm.replace(
    `import { exampleGenerator } from 'example-generator/dist/esm/index.js'`,
    `import { formats } from 'example-generator/dist/esm/index.js'

// You can also import from a specific file from your library
import { exampleGenerator } from 'example-generator/dist/esm/exampleGenerator.js'`
  ),
}

const multipleTitle = 'Multiple require statements'
const multipleMd = {
  cjs: basicMd.cjs
    .replace(basicTitle, multipleTitle)
    .replace(
      `const myPackage = require('example-generator')`,
      `const { formats } = require('example-generator')

// You can also import from a specific file from your library
const { exampleGenerator } = require('example-generator/dist/cjs/exampleGenerator.js')`
    )
    .replace('myPackage.exampleGenerator()', 'exampleGenerator()'),
  esm: basicMd.esm.replace(basicTitle, multipleTitle).replace(
    `import { exampleGenerator } from 'example-generator'`,
    `import { formats } from 'example-generator'

// You can also import from a specific file from your library
import { exampleGenerator } from 'example-generator/dist/esm/exampleGenerator.js'`
  ),
  iife: basicMd.iife.replace(basicTitle, multipleTitle).replace(
    `<script src="https://unpkg.com/example-generator@^${examples.pkg.version}"></script>`,
    `<script src="https://unpkg.com/example-generator@^${examples.pkg.version}"></script>

<!-- You can also import from a specific file from your library -->
<script src="https://unpkg.com/example-generator@^${examples.pkg.version}/dist/iife/exampleGenerator.js"></script>`
  ),
  nodeEsm: basicMd.nodeEsm.replace(basicTitle, multipleTitle).replace(
    `import { exampleGenerator } from 'example-generator/dist/esm/index.js'`,
    `import { formats } from 'example-generator/dist/esm/index.js'

// You can also import from a specific file from your library
import { exampleGenerator } from 'example-generator/dist/esm/exampleGenerator.js'`
  ),
}

/**
 * Cleanup
 */

beforeEach(function () {
  rmdirSync('examples', { recursive: true })
})

afterAll(function () {
  rmdirSync('examples', { recursive: true })
})

/**
 * Generator options
 */
describe('generator options', function () {
  it('generates all types', () => {
    expect.assertions(8)

    examples.generate({
      exportName: 'myPackage',
      sources: [path.join('examplesSrc', 'basicExample.js')],
    })

    // JS output
    expect(
      readFileSync(path.join('examples', 'cjs', 'basicExample.js'), 'utf-8')
    ).toMatch(basicJs.cjs)
    expect(
      readFileSync(path.join('examples', 'esm', 'basicExample.js'), 'utf-8')
    ).toMatch(basicJs.esm)
    expect(
      readFileSync(
        path.join('examples', 'node-esm', 'basicExample.js'),
        'utf-8'
      )
    ).toMatch(basicJs.nodeEsm)
    expect(
      readFileSync(path.join('examples', 'iife', 'basicExample.html'), 'utf-8')
    ).toMatch(basicJs.iife)

    // Markdown output
    expect(
      readFileSync(path.join('examples', 'cjs', 'examples.md'), 'utf-8')
    ).toMatch(basicMd.cjs)
    expect(
      readFileSync(path.join('examples', 'esm', 'examples.md'), 'utf-8')
    ).toMatch(basicMd.esm)
    expect(
      readFileSync(path.join('examples', 'node-esm', 'examples.md'), 'utf-8')
    ).toMatch(basicMd.nodeEsm)
    expect(
      readFileSync(path.join('examples', 'iife', 'examples.md'), 'utf-8')
    ).toMatch(basicMd.iife)
  })

  it('generates selected types', () => {
    expect.assertions(8)

    examples.generate({
      exportName: 'myPackage',
      sources: [path.join('examplesSrc', 'basicExample.js')],
      types: ['esm'],
    })

    // JS output
    expect(
      readFileSync(path.join('examples', 'esm', 'basicExample.js'), 'utf-8')
    ).toMatch(basicJs.esm)
    expect(
      existsSync(path.join('examples', 'cjs', 'basicExample.js'))
    ).toBeFalsy()
    expect(
      existsSync(path.join('examples', 'node-esm', 'basicExample.js'))
    ).toBeFalsy()
    expect(
      existsSync(path.join('examples', 'iife', 'basicExample.js'))
    ).toBeFalsy()

    // Markdown output
    expect(
      readFileSync(path.join('examples', 'esm', 'examples.md'), 'utf-8')
    ).toMatch(basicMd.esm)
    expect(existsSync(path.join('examples', 'cjs', 'examples.md'))).toBeFalsy()
    expect(
      existsSync(path.join('examples', 'node-esm', 'examples.md'))
    ).toBeFalsy()
    expect(existsSync(path.join('examples', 'iife', 'examples.md'))).toBeFalsy()
  })

  it('generates in selected folder', () => {
    expect.assertions(2)

    examples.generate({
      exportName: 'myPackage',
      sources: [path.join('examplesSrc', 'basicExample.js')],
      target: 'examples2',
      types: ['esm'],
    })

    // JS output
    expect(readFileSync('examples2/esm/basicExample.js', 'utf-8')).toMatch(
      basicJs.esm
    )

    // Markdown output
    expect(readFileSync('examples2/esm/examples.md', 'utf-8')).toMatch(
      basicMd.esm
    )

    // Clean up
    rmdirSync('./examples2', { recursive: true })
  })

  it('throws unknown type', () => {
    expect.assertions(1)

    expect(() =>
      examples.generate({
        exportName: 'myPackage',
        sources: [path.join('examplesSrc', 'basicExample.js')],
        types: ['unknown' as formats],
      })
    ).toThrow('Target type unknown not recognized')
  })

  it('throws source with no extension', () => {
    expect.assertions(1)

    expect(() =>
      examples.generate({
        exportName: 'myPackage',
        sources: [path.join('examplesSrc', 'basicExample')],
        types: ['esm'],
      })
    ).toThrow(
      path.join(
        'examplesSrc',
        'basicExample is not a recognized file name. Please make sure it contains an extension.'
      )
    )
  })
})

/**
 * Overwriting outputs
 */
describe('overwriting output formats', function () {
  it('overwrites one output format', () => {
    expect.assertions(8)

    examples.generate({
      exportName: 'myPackage',
      sources: [
        path.join('examplesSrc', 'predefinedOutput.js'),
        path.join('examplesSrc', 'predefinedOutput.cjs.js'),
      ],
    })

    // JS output
    expect(
      readFileSync(path.join('examples', 'cjs', 'predefinedOutput.js'), 'utf-8')
    ).toMatch(
      readFileSync(path.join('examplesSrc', 'predefinedOutput.cjs.js'), 'utf-8')
    )
    expect(
      readFileSync(path.join('examples', 'esm', 'predefinedOutput.js'), 'utf-8')
    ).toMatch(predefinedJs.esm)
    expect(
      readFileSync(
        path.join('examples', 'node-esm', 'predefinedOutput.js'),
        'utf-8'
      )
    ).toMatch(predefinedJs.nodeEsm)
    expect(
      readFileSync(
        path.join('examples', 'iife', 'predefinedOutput.html'),
        'utf-8'
      )
    ).toMatch(predefinedJs.iife)

    // Markdown output
    expect(
      readFileSync(path.join('examples', 'cjs', 'examples.md'), 'utf-8')
    ).toMatch(
      predefinedMd.cjs
        .replace(
          "const myPackage = require('example-generator')",
          "const { exampleGenerator } = require('example-generator')"
        )
        .replace('myPackage.exampleGenerator()', 'exampleGenerator()')
    )
    expect(
      readFileSync(path.join('examples', 'esm', 'examples.md'), 'utf-8')
    ).toMatch(predefinedMd.esm)
    expect(
      readFileSync(path.join('examples', 'node-esm', 'examples.md'), 'utf-8')
    ).toMatch(predefinedMd.nodeEsm)
    expect(
      readFileSync(path.join('examples', 'iife', 'examples.md'), 'utf-8')
    ).toMatch(predefinedMd.iife)
  })

  it('overwrites all outputs', () => {
    expect.assertions(2)

    examples.generate({
      exportName: 'myPackage',
      sources: [
        path.join('examplesSrc', 'predefinedOutput.js'),
        path.join('examplesSrc', 'predefinedOutput.cjs.js'),
      ],
      types: ['cjs'],
    })

    // JS output
    expect(
      readFileSync(path.join('examples', 'cjs', 'predefinedOutput.js'), 'utf-8')
    ).toMatch(
      readFileSync(path.join('examplesSrc', 'predefinedOutput.cjs.js'), 'utf-8')
    )

    // Markdown output
    expect(
      readFileSync(path.join('examples', 'cjs', 'examples.md'), 'utf-8')
    ).toMatch(
      predefinedMd.cjs
        .replace(
          "const myPackage = require('example-generator')",
          "const { exampleGenerator } = require('example-generator')"
        )
        .replace('myPackage.exampleGenerator()', 'exampleGenerator()')
    )
  })

  it('throws when the base format is not supplied but needed', () => {
    expect.assertions(1)

    expect(() =>
      examples.generate({
        exportName: 'myPackage',
        sources: [path.join('examplesSrc', 'predefinedOutput.cjs.js')],
        types: ['cjs', 'esm'],
      })
    ).toThrow('You need to specify a base JS file to convert from')
  })

  it('does not throw when the base format is not supplied and not needed', () => {
    expect.assertions(1)

    expect(() =>
      examples.generate({
        exportName: 'myPackage',
        sources: [path.join('examplesSrc', 'predefinedOutput.cjs.js')],
        types: ['cjs'],
      })
    ).not.toThrow('You need to specify a base JS file to convert from')
  })
})

/**
 * Source analysis
 */
describe('source analysis', function () {
  describe('throws when require statements are not found to convert', function () {
    it('commonJS', () => {
      expect.assertions(1)

      expect(() =>
        examples.generate({
          exportName: 'myPackage',
          sources: [
            path.join('examplesSrc', 'badExampleWithNoRequireStatements.js'),
          ],
          types: ['cjs'],
        })
      ).toThrow('No require statements found. Cannot convert to CommonJS.')
    })

    it('iife', () => {
      expect.assertions(1)

      expect(() =>
        examples.generate({
          exportName: 'myPackage',
          sources: [
            path.join('examplesSrc', 'badExampleWithNoRequireStatements.js'),
          ],
          types: ['iife'],
        })
      ).toThrow('No require statements found. Cannot convert to IIFE.')
    })
  })

  it('works with native node ESM modules and iife when no index is specified', () => {
    expect.assertions(2)

    const source = `/**
 * Include the example generator dependency
 */
const { exampleGenerator } = require('../dist/cjs/another/path')

const examples = new exampleGenerator()`

    expect(examples.toNodeEsm(source)).toMatch(`/**
 * Include the example generator dependency
 */
import { exampleGenerator } from 'example-generator/dist/esm/another/path/index.js'

const examples = new exampleGenerator()`)

    expect(examples.toIife(source, 'myPackage')).toMatch(`<!--
Include the example generator dependency
 -->

<script src="https://unpkg.com/example-generator@^0.0.0/dist/iife/another/path/index.js"></script>

const examples = new myPackage.exampleGenerator()`)
  })

  it('works with multiple require statements', () => {
    expect.assertions(8)

    examples.generate({
      exportName: 'myPackage',
      sources: [path.join('examplesSrc', 'multipleRequireStatements.js')],
    })

    // JS output
    expect(
      readFileSync(
        path.join('examples', 'cjs', 'multipleRequireStatements.js'),
        'utf-8'
      )
    ).toMatch(multipleJs.cjs)
    expect(
      readFileSync(
        path.join('examples', 'esm', 'multipleRequireStatements.js'),
        'utf-8'
      )
    ).toMatch(multipleJs.esm)
    expect(
      readFileSync(
        path.join('examples', 'node-esm', 'multipleRequireStatements.js'),
        'utf-8'
      )
    ).toMatch(multipleJs.nodeEsm)
    expect(
      readFileSync(
        path.join('examples', 'iife', 'multipleRequireStatements.html'),
        'utf-8'
      )
    ).toMatch(multipleJs.iife)

    // Markdown output
    expect(
      readFileSync(path.join('examples', 'cjs', 'examples.md'), 'utf-8')
    ).toMatch(multipleMd.cjs)
    expect(
      readFileSync(path.join('examples', 'esm', 'examples.md'), 'utf-8')
    ).toMatch(multipleMd.esm)
    expect(
      readFileSync(path.join('examples', 'node-esm', 'examples.md'), 'utf-8')
    ).toMatch(multipleMd.nodeEsm)
    expect(
      readFileSync(path.join('examples', 'iife', 'examples.md'), 'utf-8')
    ).toMatch(multipleMd.iife)
  })
})
