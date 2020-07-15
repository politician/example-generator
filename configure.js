const fs = require('fs')

const added_files = process.env.NEAT_ADDED_FILES
const environment = process.env.NEAT_ASK_TARGET_ENVIRONMENT
const typescript = process.env.NEAT_ASK_TYPESCRIPT
const repository_name = process.env.NEAT_ASK_REPOSITORY_NAME
const package_name = process.env.NEAT_ASK_PACKAGE_NAME
const package_description = process.env.NEAT_ASK_PACKAGE_DESCRIPTION
const author_name = process.env.NEAT_ASK_AUTHOR_NAME
const author_email = process.env.NEAT_ASK_AUTHOR_EMAIL
const author_url = process.env.NEAT_ASK_AUTHOR_URL
const license = process.env.NEAT_ASK_LICENSE

/*
echo 'All' && git checkout . && NEAT_ASK_TARGET_ENVIRONMENT='Browser, React, Vue.js, Node.js' NEAT_ASK_TYPESCRIPT='yes' NEAT_ASK_REPOSITORY_NAME='incorrupt/test-repo' NEAT_ASK_PACKAGE_NAME='neat-npm' NEAT_ASK_PACKAGE_DESCRIPTION='Test description' NEAT_ASK_AUTHOR_NAME='Romain Barissat' NEAT_ASK_AUTHOR_EMAIL='romain@barissat.com' NEAT_ASK_AUTHOR_URL='https://olivr.com' NEAT_ASK_LICENSE='Apache-2.0' NEAT_ADDED_FILES='./src/index.ts, ./src/myModule.ts, ./src/myModule.js, ./tests/myModule.test.ts, ./tests/tsconfig.json, ./.eslintrc.json, ./.prettierrc.json, ./babel.config.js, ./package.json, ./README.md, ./.config/rollup.config.js, ./.config/jest.config.json, ./tsconfig.json, ./yarn.lock' node configure.js && npx prettier --write .eslintrc.json package.json babel.config.js .config/rollup.config.js .config/jest.config.json && git status && yarn test
echo 'No typescript' && rm -rf src tests && git checkout . && NEAT_ASK_TARGET_ENVIRONMENT='Browser, React, Vue.js, Node.js' NEAT_ASK_TYPESCRIPT='no' NEAT_ASK_REPOSITORY_NAME='incorrupt/test-repo' NEAT_ASK_PACKAGE_NAME='neat-npm' NEAT_ASK_PACKAGE_DESCRIPTION='Test description' NEAT_ASK_AUTHOR_NAME='Romain Barissat' NEAT_ASK_AUTHOR_EMAIL='romain@barissat.com' NEAT_ASK_AUTHOR_URL='https://olivr.com' NEAT_ASK_LICENSE='Apache-2.0' NEAT_ADDED_FILES='./src/index.ts, ./src/myModule.ts, ./src/myModule.js, ./tests/myModule.test.ts, ./tests/tsconfig.json, ./.eslintrc.json, ./.prettierrc.json, ./babel.config.js, ./package.json, ./README.md, ./.config/rollup.config.js, ./.config/jest.config.json, ./tsconfig.json, ./yarn.lock' node configure.js && npx prettier --write .eslintrc.json package.json babel.config.js .config/rollup.config.js .config/jest.config.json && git status && yarn test
echo 'No node' && rm -rf src tests && git checkout . && NEAT_ASK_TARGET_ENVIRONMENT='Browser, React, Vue.js' NEAT_ASK_TYPESCRIPT='yes' NEAT_ASK_REPOSITORY_NAME='incorrupt/test-repo' NEAT_ASK_PACKAGE_NAME='neat-npm' NEAT_ASK_PACKAGE_DESCRIPTION='Test description' NEAT_ASK_AUTHOR_NAME='Romain Barissat' NEAT_ASK_AUTHOR_EMAIL='romain@barissat.com' NEAT_ASK_AUTHOR_URL='https://olivr.com' NEAT_ASK_LICENSE='Apache-2.0' NEAT_ADDED_FILES='./src/index.ts, ./src/myModule.ts, ./src/myModule.js, ./tests/myModule.test.ts, ./tests/tsconfig.json, ./.eslintrc.json, ./.prettierrc.json, ./babel.config.js, ./package.json, ./README.md, ./.config/rollup.config.js, ./.config/jest.config.json, ./tsconfig.json, ./yarn.lock' node configure.js && npx prettier --write .eslintrc.json package.json babel.config.js .config/rollup.config.js .config/jest.config.json && git status && yarn test
echo 'No browser' && rm -rf src tests && git checkout . && NEAT_ASK_TARGET_ENVIRONMENT='React, Vue.js, Node.js' NEAT_ASK_TYPESCRIPT='yes' NEAT_ASK_REPOSITORY_NAME='incorrupt/test-repo' NEAT_ASK_PACKAGE_NAME='neat-npm' NEAT_ASK_PACKAGE_DESCRIPTION='Test description' NEAT_ASK_AUTHOR_NAME='Romain Barissat' NEAT_ASK_AUTHOR_EMAIL='romain@barissat.com' NEAT_ASK_AUTHOR_URL='https://olivr.com' NEAT_ASK_LICENSE='Apache-2.0' NEAT_ADDED_FILES='./src/index.ts, ./src/myModule.ts, ./src/myModule.js, ./tests/myModule.test.ts, ./tests/tsconfig.json, ./.eslintrc.json, ./.prettierrc.json, ./babel.config.js, ./package.json, ./README.md, ./.config/rollup.config.js, ./.config/jest.config.json, ./tsconfig.json, ./yarn.lock' node configure.js && npx prettier --write .eslintrc.json package.json babel.config.js .config/rollup.config.js .config/jest.config.json && git status && yarn test
echo 'No react' && rm -rf src tests && git checkout . && NEAT_ASK_TARGET_ENVIRONMENT='Browser, Vue.js, Node.js' NEAT_ASK_TYPESCRIPT='yes' NEAT_ASK_REPOSITORY_NAME='incorrupt/test-repo' NEAT_ASK_PACKAGE_NAME='neat-npm' NEAT_ASK_PACKAGE_DESCRIPTION='Test description' NEAT_ASK_AUTHOR_NAME='Romain Barissat' NEAT_ASK_AUTHOR_EMAIL='romain@barissat.com' NEAT_ASK_AUTHOR_URL='https://olivr.com' NEAT_ASK_LICENSE='Apache-2.0' NEAT_ADDED_FILES='./src/index.ts, ./src/myModule.ts, ./src/myModule.js, ./tests/myModule.test.ts, ./tests/tsconfig.json, ./.eslintrc.json, ./.prettierrc.json, ./babel.config.js, ./package.json, ./README.md, ./.config/rollup.config.js, ./.config/jest.config.json, ./tsconfig.json, ./yarn.lock' node configure.js && npx prettier --write .eslintrc.json package.json babel.config.js .config/rollup.config.js .config/jest.config.json && git status && yarn test
echo 'No vue' && rm -rf src tests && git checkout . && NEAT_ASK_TARGET_ENVIRONMENT='Browser, React, Node.js' NEAT_ASK_TYPESCRIPT='yes' NEAT_ASK_REPOSITORY_NAME='incorrupt/test-repo' NEAT_ASK_PACKAGE_NAME='neat-npm' NEAT_ASK_PACKAGE_DESCRIPTION='Test description' NEAT_ASK_AUTHOR_NAME='Romain Barissat' NEAT_ASK_AUTHOR_EMAIL='romain@barissat.com' NEAT_ASK_AUTHOR_URL='https://olivr.com' NEAT_ASK_LICENSE='Apache-2.0' NEAT_ADDED_FILES='./src/index.ts, ./src/myModule.ts, ./src/myModule.js, ./tests/myModule.test.ts, ./tests/tsconfig.json, ./.eslintrc.json, ./.prettierrc.json, ./babel.config.js, ./package.json, ./README.md, ./.config/rollup.config.js, ./.config/jest.config.json, ./tsconfig.json, ./yarn.lock' node configure.js && npx prettier --write .eslintrc.json package.json babel.config.js .config/rollup.config.js .config/jest.config.json && git status && yarn test

npx eslint babel.config.js .config/rollup.config.js --fix
*/

// Files
if (typescript === 'yes') {
  fs.unlinkSync('src/myModule.js')
} else {
  fs.unlinkSync('tsconfig.json')
  fs.unlinkSync('src/myModule.ts')
  fs.renameSync('src/index.ts', 'src/index.js')
  fs.unlinkSync('tests/tsconfig.json')
  fs.renameSync('tests/myModule.test.ts', 'tests/myModule.test.js')
}

// Edit package.json
if (/package\.json/i.test(added_files) && fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json'))

  if (package_name) pkg.name = package_name
  else delete pkg.name

  if (package_description) pkg.description = package_description
  else delete pkg.description

  if (author_name) pkg.author.name = author_name
  else delete pkg.author.name

  if (author_email) pkg.author.email = author_email
  else delete pkg.author.email

  if (author_url) pkg.author.url = author_url
  else delete pkg.author.url

  if (!author_name && !author_email && !author_url) {
    delete pkg.author
    delete pkg.contributors
  } else pkg.contributors = [pkg.author]

  if (repository_name) {
    pkg.repository = pkg.repository.replace(
      'olivr-templates/neat-npm',
      repository_name
    )
    pkg.homepage = pkg.repository
    pkg.bugs.url = pkg.repository + '/issues'
  } else {
    delete pkg.repository
    delete pkg.homepage
    delete pkg.bugs
  }

  if (license) pkg.license = license

  if (fs.existsSync('./docs')) pkg.directories.doc = './docs'

  if (!/node\.js/i.test(environment)) {
    delete pkg.devDependencies['eslint-plugin-node']
    delete pkg.devDependencies['@rollup/plugin-alias']
  }

  if (
    !/browser/i.test(environment) &&
    !/vue\.js/i.test(environment) &&
    !/react/i.test(environment)
  ) {
    delete pkg.devDependencies['babel-preset-minify']
    delete pkg.devDependencies['@rollup/plugin-multi-entry']
    delete pkg.devDependencies['rollup-plugin-terser']
    delete pkg.devDependencies['terser']
    delete pkg.devDependencies['varname']
    delete pkg.scripts['build:js:min']
    pkg.scripts['build'] = pkg.scripts['build'].replace(
      ' && yarn build:js:min',
      ''
    )
  }

  if (!/vue\.js/i.test(environment)) {
    delete pkg.devDependencies['eslint-plugin-vue']
  }

  if (!/react/i.test(environment)) {
    delete pkg.devDependencies['eslint-plugin-react']
    delete pkg.devDependencies['@babel/preset-react']
  }

  if (typescript === 'no') {
    delete pkg.devDependencies['@babel/plugin-proposal-class-properties']
    delete pkg.devDependencies['@babel/plugin-proposal-object-rest-spread']
    delete pkg.devDependencies['@babel/preset-typescript']
    delete pkg.devDependencies['@types/jest']
    delete pkg.devDependencies['@typescript-eslint/eslint-plugin']
    delete pkg.devDependencies['@typescript-eslint/parser']
    delete pkg.dependencies['@types/node']
    delete pkg.scripts['test:types']
    delete pkg.scripts['test:types:watch']
    pkg.scripts['test'] = pkg.scripts['test'].replace(' && yarn test:types', '')
    pkg.scripts['build:types'] =
      'tsc --emitDeclarationOnly --allowJs --declaration --declarationMap --declarationDir ./types src/*'
  }

  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')
}

// Edit jest.config.json
if (
  /jest.config.json/i.test(added_files) &&
  fs.existsSync('.config/jest.config.json')
) {
  const jest = JSON.parse(fs.readFileSync('.config/jest.config.json'))

  if (!/node\.js/i.test(environment)) {
    delete jest.projects
    jest.testEnvironment = 'jsdom'
    jest.rootDir = '../'
    jest.testMatch = ['<rootDir>/tests/**/*.[jt]s']
    jest.testURL = 'http://localhost'
  }

  if (
    !/browser/i.test(environment) &&
    !/vue\.js/i.test(environment) &&
    !/react/i.test(environment)
  ) {
    delete jest.testURL
    if (jest.projects) delete jest.projects
    jest.testEnvironment = 'node'
    jest.rootDir = '../'
    jest.testMatch = ['<rootDir>/tests/**/*.[jt]s']
    delete jest.testURL
  }

  if (typescript === 'no') {
    jest.collectCoverageFrom = jest.collectCoverageFrom.map((v) =>
      v.replace('[jt]s?(x)', 'js?(x)')
    )
    if (jest.projects)
      jest.projects = jest.projects.map(
        (proj) =>
          (proj.testMatch = proj.testMatch.map((v) =>
            v.replace('[jt]s', 'js')
          )) && proj
      )
    if (jest.testMatch)
      jest.testMatch = jest.testMatch.map((v) => v.replace('[jt]s', 'js'))
  }

  fs.writeFileSync(
    '.config/jest.config.json',
    JSON.stringify(jest, null, 2) + '\n'
  )
}

// Edit rollup.config.js
if (
  /rollup.config.js/i.test(added_files) &&
  fs.existsSync('.config/rollup.config.js')
) {
  let rollup = fs.readFileSync('.config/rollup.config.js', 'utf-8')

  if (!/node\.js/i.test(environment)) {
    rollup = rollup
      .replace('builtins: true', 'builtins: false')
      .replace(/import alias.*/i, '')
      .replace(/^\s+alias.*/im, '')
      .replace(/\/{2} Convert Babel directory[\s\S]+?(?=\n\n)/im, '')
  }

  if (!/browser/i.test(environment)) {
    rollup = rollup
      .replace(/import (multi|pkg|{ terser }|varname).*/gi, '')
      .replace(/\/[*\s\w]+IIFE[\s\S]+?(?=\/\*\*)/i, '') // Configuration specific to IIFE modules
      .replace(/\/{2} IIFE modules[\s\S]+(?=\])/i, '')
      .replace(/\/\*\*\n[\s\S]+?\*\//gi, '') // Delete all /** comment blocks */
  }

  if (typescript === 'no') {
    rollup = rollup
      .replace(/\[jt\]s\?\(x\)/gi, 'js?(x)')
      .replace(", 'src/**/*.ts', 'src/**/*.tsx'", '')
      .replace('src/**/index.ts', 'src/**/index.js')
      .replace("[...DEFAULT_EXTENSIONS, '.ts', '.tsx']", 'DEFAULT_EXTENSIONS')
  }

  fs.writeFileSync('.config/rollup.config.js', rollup)
}

// Edit babel.config.js
if (
  /babel\.config\.js/i.test(added_files) &&
  fs.existsSync('babel.config.js')
) {
  let babel = fs.readFileSync('babel.config.js', 'utf-8')

  if (!/browser/i.test(environment))
    babel = babel.replace(/[\s]+\*.*IIFE.+$/im, '')

  if (!/react/i.test(environment))
    babel = babel.replace(/[\s]+.+react.+$/im, '')

  if (typescript === 'no')
    babel = babel.replace(
      /[\s]+.+(typescript|proposal-class-properties|proposal-object-rest-spread).+$/gim,
      ''
    )

  fs.writeFileSync('babel.config.js', babel)
}

// Edit .eslintrc.json
if (/\.eslintrc\.json/i.test(added_files) && fs.existsSync('.eslintrc.json')) {
  const eslint = JSON.parse(fs.readFileSync('.eslintrc.json'))

  if (
    !/browser/i.test(environment) &&
    !/vue\.js/i.test(environment) &&
    !/react/i.test(environment)
  ) {
    eslint.env.browser = false
  }

  if (!/node\.js/i.test(environment)) {
    eslint.env.node = false

    let index = eslint.extends.indexOf('plugin:node/recommended')
    if (index > -1) eslint.extends.splice(index, 1)
    index = eslint.overrides[0].extends.indexOf('plugin:node/recommended')
    if (index > -1) eslint.overrides[0].extends.splice(index, 1)

    index = eslint.plugins.indexOf('node')
    if (index > -1) eslint.extends.splice(index, 1)

    delete eslint.rules['node/no-unsupported-features/es-syntax']
    delete eslint.rules['node/no-unsupported-features/es-builtins']
    delete eslint.rules['node/no-extraneous-import']
    delete eslint.overrides[0].rules['node/no-unsupported-features/es-syntax']
    delete eslint.overrides[0].rules['node/no-unsupported-features/es-builtins']
    delete eslint.overrides[0].rules['node/no-extraneous-import']

    delete eslint.overrides[0].settings
  }

  if (!/vue\.js/i.test(environment)) {
    let index = eslint.extends.indexOf('prettier/vue')
    if (index > -1) eslint.extends.splice(index, 1)
    index = eslint.overrides[0].extends.indexOf('prettier/vue')
    if (index > -1) eslint.overrides[0].extends.splice(index, 1)
  }

  if (!/react/i.test(environment)) {
    let index = eslint.extends.indexOf('prettier/react')
    if (index > -1) eslint.extends.splice(index, 1)
    index = eslint.overrides[0].extends.indexOf('prettier/react')
    if (index > -1) eslint.overrides[0].extends.splice(index, 1)
  }

  if (typescript === 'no') {
    delete eslint.overrides
  }

  fs.writeFileSync('.eslintrc.json', JSON.stringify(eslint, null, 2))
}

//fs.unlinkSync(__filename)
