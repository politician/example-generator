import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import os from 'os'
import path from 'path'

export class exampleGenerator {
  availableFormats: Array<formats> = ['esm', 'cjs', 'node-esm', 'iife']
  requirePattern = /const (.+) = require\('\.\.\/dist\/cjs\/?(.*)'\)$/gm
  pkg: packageJson
  basePath: string

  constructor(basePath = './') {
    this.basePath = path.normalize(basePath)
    const pkg: string = readFileSync(
      path.join(this.basePath, 'package.json'),
      'utf-8'
    )
    this.pkg = JSON.parse(pkg)
  }

  /**
   * Generate examples
   */
  generate({
    exportName,
    sources,
    target = path.join(this.basePath, 'examples'),
    types = ['esm', 'cjs', 'node-esm', 'iife'],
  }: options): void {
    /**
     * Prepare markdown
     */
    const markdown: markdown = {}

    types.forEach((type) => {
      if (type === 'esm') markdown.esm = `# Using ES modules${os.EOL}`
      else if (type === 'cjs')
        markdown.cjs = `# Using CommonJS modules${os.EOL}`
      else if (type === 'iife')
        markdown.iife = `# Using natively in the browser${os.EOL}`
      else if (type === 'node-esm')
        markdown[
          'node-esm'
        ] = `# Using native ES Modules in Node.js (12+)${os.EOL}`
      else throw `Target type ${type} not recognized`
    })

    /**
     * Group similar sources
     */
    const combinedSources: combinedSources = {}

    sources.forEach((sourcePath: string) => {
      const extMatch = sourcePath.match(/(\.\w+)+$/)
      if (!extMatch)
        throw `${sourcePath} is not a recognized file name. Please make sure it contains an extension.`
      const extension = extMatch[0]

      const fileNamePath = sourcePath.replace(extension, '')

      if (!Object.prototype.hasOwnProperty.call(combinedSources, fileNamePath))
        combinedSources[fileNamePath] = {
          base: '',
        }

      const extParts = extension.split('.')
      const format = extParts[1] as formats | 'js'
      if (format === 'js') combinedSources[fileNamePath].base = extension
      else if (this.availableFormats.includes(format))
        combinedSources[fileNamePath][format] = extension
    })

    /**
     * Process each source
     */
    Object.keys(combinedSources).forEach((fileNamePath) => {
      if (
        !combinedSources[fileNamePath].base &&
        JSON.stringify(
          Object.keys(combinedSources[fileNamePath])
            .filter((f) => f != 'base')
            .sort()
        ) != JSON.stringify(types.sort())
      )
        throw 'You need to specify a base JS file to convert from'

      const fileName = path.basename(fileNamePath)
      const title = fileName
        .replace(/[A-Z]/g, (m) => ` ${m.toLowerCase()}`)
        .replace(/^./i, (m) => `## ${m.toUpperCase()}`)

      /**
       * Process each type
       */
      types.forEach((type) => {
        let targetJs = ''
        let writeExtension = '.js'

        if (Object.keys(combinedSources[fileNamePath]).includes(type)) {
          targetJs = readFileSync(
            fileNamePath + combinedSources[fileNamePath][type],
            'utf-8'
          )
        } else {
          const baseJs = readFileSync(
            fileNamePath + combinedSources[fileNamePath].base,
            'utf-8'
          )

          if (type === 'esm') targetJs = this.toEsm(baseJs)
          else if (type === 'node-esm') targetJs = this.toNodeEsm(baseJs)
          else if (type === 'cjs') targetJs = this.toCjs(baseJs, exportName)
          else if (type === 'iife') {
            targetJs = this.toIife(baseJs, exportName)
            writeExtension = '.html'
          }
        }

        markdown[type] = markdown[type] + this.toMarkdown(targetJs, title)

        const dir = path.join(target, type)
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
        writeFileSync(
          path.join(dir, fileName + writeExtension),
          targetJs,
          'utf-8'
        )
      })
    })

    /**
     * Write markdown for all examples per type
     */
    types.forEach((type) => {
      if (markdown[type]) {
        writeFileSync(
          path.join(target, type, 'examples.md'),
          markdown[type] as string,
          'utf-8'
        )
      }
    })
  }

  /**
   * Generate CommonJs
   */
  toCjs(source: string, exportName: string): string {
    let cjs = source

    const requireStatements = Array.from(source.matchAll(this.requirePattern))

    // Error if no require statement found
    if (requireStatements.length < 1)
      throw 'No require statements found. Cannot convert to CommonJS.'
    // Replace relative path with package name
    else if (requireStatements.length > 1) {
      requireStatements.forEach(([statement, imports, subPath]) => {
        cjs = cjs.replace(
          statement,
          subPath
            ? `const ${imports} = require('${this.pkg.name}/dist/cjs/${subPath}')`
            : `const ${imports} = require('${this.pkg.name}')`
        )
      })
    }
    // Replace relative path with package name and imports with library name
    else {
      const [statement, imports, subPath] = requireStatements[0]

      cjs = cjs.replace(
        statement,
        subPath
          ? `const ${exportName} = require('${this.pkg.name}/dist/cjs/${subPath}')`
          : `const ${exportName} = require('${this.pkg.name}')`
      )

      // Replace imported variables with object properties
      const importNames = Array.from(imports.matchAll(/[{,] (\w+)/g))
        .map((m) => m[1])
        .join('|')

      cjs = cjs.replace(RegExp(`(${importNames})`, 'g'), `${exportName}.$1`)
    }

    return cjs
  }

  /**
   * Generate ES Modules
   */
  toEsm(source: string): string {
    const esm = source.replace(this.requirePattern, (m: string) => {
      const replacement =
        m.replace(this.requirePattern, '$2') === ''
          ? `import $1 from '${this.pkg.name}'`
          : `import $1 from '${this.pkg.name}/dist/esm/$2'`
      return m.replace(this.requirePattern, replacement)
    })

    return esm
  }

  /**
   * Generate IIFE
   */
  toIife(source: string, exportName: string): string {
    let iife = source

    const requireStatements = Array.from(source.matchAll(this.requirePattern))

    // Error if no require statement found
    if (requireStatements.length < 1)
      throw 'No require statements found. Cannot convert to IIFE.'

    // Replace relative path with package name
    iife = '<script type="text/javascript">'.concat(
      os.EOL,
      iife,
      os.EOL,
      '</script>'
    )

    requireStatements.forEach(([statement, imports, subPath]) => {
      let replacement

      if (subPath === '') {
        replacement = `<script src="https://unpkg.com/${this.pkg.name}@^${this.pkg.version}"></script>`
      } else {
        if (!/\.js$/.test(subPath)) {
          if (/\/$/.test(subPath)) subPath.slice(0, -1)
          subPath = subPath.concat('/index.js')
        }
        replacement = `<script src="https://unpkg.com/${this.pkg.name}@^${this.pkg.version}/dist/iife/${subPath}"></script>`
      }

      iife = iife.replace(statement, replacement)

      // Replace imported variables with object properties
      const importNames = Array.from(imports.matchAll(/[{,] (\w+)/g))
        .map((m) => m[1])
        .join('|')

      iife = iife.replace(
        RegExp(`(${importNames})(?![^"]+">)`, 'g'),
        `${exportName}.$1`
      )
    })

    iife = iife
      .replace(
        /\/\*\*\r?\n([\s\S]+?)\r?\n \*\//g,
        `</script>${os.EOL}<!--${os.EOL}$1${os.EOL} -->${os.EOL}<script type="text/javascript">`
      )
      .replace(
        /<script type="text\/javascript">((\s+<script src=.+<\/script>)+)/g,
        '$1'
      )
      .replace(/<script type="text\/javascript">\s+<\/script>/g, '')
      .replace(/(<\/script>\s+){2,}/g, `$1${os.EOL}`)
      .replace(
        /(?:^\s*|<\/script>)(.*?)(?:<script type="text\/javascript">|\s*$)/gs,
        (m) => m.replace(/^\/\/\s*(.*)$/gm, '<!-- $1 -->')
      )
      .replace(/<!--([\s\S]+?)-->/g, (m: string) => m.replace(/^ *\* */gm, ''))

    return iife
  }

  /**
   * Generate native ES6 for Node.js
   */
  toNodeEsm(source: string): string {
    let nodeEsm = source

    const requireStatements = Array.from(source.matchAll(this.requirePattern))

    requireStatements.forEach(([statement, imports, subPath]) => {
      let replacement

      if (subPath === '') {
        replacement = `import ${imports} from '${this.pkg.name}/dist/esm/index.js'`
      } else {
        if (!/\.js$/.test(subPath)) {
          if (/\/$/.test(subPath)) subPath.slice(0, -1)
          subPath = subPath.concat('/index.js')
        }
        replacement = `import ${imports} from '${this.pkg.name}/dist/esm/${subPath}'`
      }

      nodeEsm = nodeEsm.replace(statement, replacement)
    })

    return nodeEsm
  }

  /**
   * Generate markdown
   */
  toMarkdown(source: string, title: string): string {
    const formattedTitle = os.EOL.concat(title, os.EOL, os.EOL)
    const formattedSource = os.EOL.concat(source, os.EOL)
    return `${formattedTitle}\`\`\`js${formattedSource}\`\`\``
      .replace(/\/\*\*(\r?\n)([\s\S]+?)\r?\n \*\//g, '```$1/**$1$2$1 */$1```js')
      .replace(/<!--(\r?\n)([\s\S]+?)-->/g, '```$1$2$1```html$1')
      .replace(/^[/\s]\*[/\s*]/gm, '')
      .replace(/```(js|html)[\s]+```/gm, '')
      .replace(/```([\s\S]+?)```/g, (m) =>
        m
          .replace(/^```(js|html)(\r?\n){2,}/, '```$1$2')
          .replace(/(\r?\n)+```$/, '$1```$1')
      )
      .replace(/(\r?\n){2,}/gm, '$1$1')
      .replace(/ +$/gm, '')
  }
}

export type formats = 'esm' | 'cjs' | 'node-esm' | 'iife'

export type options = {
  exportName: string
  sources: Array<string>
  target?: string
  types?: Array<formats>
}

export type combinedSources = {
  [k: string]: {
    base?: string
  } & {
    [k in formats]?: string
  }
}

export type markdown = {
  [k in formats]?: string
}

export type packageJson = {
  name?: string
  version?: string
}
