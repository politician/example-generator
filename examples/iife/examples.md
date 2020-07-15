# Using natively in the browser

## Multiple require statements

Include the example generator dependency

```html
<script src="https://unpkg.com/example-generator@^0.0.0"></script>

<!-- You can also import from a specific file from your library -->
<script src="https://unpkg.com/example-generator@^0.0.0/dist/iife/exampleGenerator.js"></script>
```

Use the example generator

```html
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
```
