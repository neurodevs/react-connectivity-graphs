import esbuild from 'esbuild'
import stylePlugin from 'esbuild-style-plugin'

esbuild
    .build({
        entryPoints: ['src/index.tsx'],
        bundle: true,
        outfile: 'public/dist/index.js',
        platform: 'browser',
        jsx: 'automatic',
        plugins: [stylePlugin()],
    })
    .catch(() => process.exit(1))
