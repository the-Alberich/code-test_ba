import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

async function start() {
  const ctx = await esbuild.context({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    outfile: 'public/index.js',
    sourcemap: true,
    minify: false,
    target: ['esnext'],
    define: {
      'process.env.NODE_ENV': JSON.stringify(isWatch ? 'development' : 'production'),
    },
    loader: { '.ts': 'ts', '.tsx': 'tsx' },
    jsx: 'automatic',
    logLevel: 'info',
  });

  if (isWatch) {
    await ctx.watch();
    console.log('👀 Watching for changes...');
  } else {
    await ctx.rebuild();
    await ctx.dispose(); // exit cleanly
    console.log('✅ Build completed.');
  }
}

start().catch(() => process.exit(1));
