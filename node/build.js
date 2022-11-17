const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/mhttp.js',
  platform: 'node',
}).catch(x => {
  console.error(x)
  process.exit(1)
})

