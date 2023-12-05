import esbuildServe from 'esbuild-serve';
import fs from 'fs-extra';
import dotenv from 'dotenv';
import opn from 'opn';

dotenv.config();

const copyIndexHtml = () => {
  fs.copySync('index.html', 'dist/index.html');
};

const copyImages = () => {
  fs.removeSync('dist/images');
  fs.copySync('src/images', 'dist/images', { overwrite: true });
};

let esbuildInstance = null;
let imagesWatcher = null;
let distWatcher = null;
let browserOpened = false; // Flag to track whether the browser has been opened

const openBrowser = async () => {
  if (browserOpened) {
    await opn('http://localhost:9200');
    browserOpened = false;
  } else {
    browserOpened = true
  }
};

const startEsbuildServe = async () => {
  if (esbuildInstance) {
    await esbuildInstance.stop();
    console.log('esbuild serve stopped.');
  }

  esbuildInstance = await esbuildServe({
    logLevel: 'info',
    entryPoints: ['src/index.ts'],
    bundle: true,
    outdir: 'dist/assets',
    // sourcemap: true,
    plugins: [
      // Add any necessary plugins here
    ],
    loader: {
      '.ts': 'tsx',
      '.png': 'file',
      '.svg': 'file',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.gif': 'file',
      '.css':'css',
    },
    minify: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env': JSON.stringify(process.env),
    },
  }, { root: 'dist', port: 9200 });
  browserOpened = false

  // Open the browser after starting the esbuild server
  await openBrowser();
};

const watchImages = () => {
  imagesWatcher = fs.watch('src/images', { recursive: true }, (eventType, filename) => {
    console.log(`Changes detected in images folder. Rebuilding...`);
    copyImages();
  });

  distWatcher =  fs.watch('dist', { recursive: true }, async (eventType, filename) => {
    // Check if the dist folder is deleted
    if (eventType === 'rename' && filename === 'dist') {
      console.log('dist folder deleted. Copying index.html and images...');
      copyIndexHtml();
      copyImages();
      await startEsbuildServe();
    }
  });

  process.on('SIGINT', () => {
    if (imagesWatcher) {
      imagesWatcher.close();
    }

    if (distWatcher) {
      distWatcher.close();
    }

    if (esbuildInstance) {
      esbuildInstance.stop();
    }

    process.exit();
  });
};

const runScript = async () => {
  copyIndexHtml();
  copyImages();

  if (process.argv.includes('--build')) {
    await startEsbuildServe();
    console.log('Running esbuild build...');
  } else {
    watchImages();
    await startEsbuildServe();
    console.log('esbuild serve started.');

    // Open the browser only when running in watch mode
    await openBrowser();
  }
};

runScript();
