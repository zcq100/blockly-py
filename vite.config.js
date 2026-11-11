import {defineConfig} from 'vite';
import {prepareAssets} from './scripts/prepare-assets.mjs';
// Safe to evaluate while a development server is running: unchanged public
// assets are never removed or rewritten by a parallel production build.
prepareAssets();
const isolationHeaders={
 'Cross-Origin-Opener-Policy':'same-origin',
 'Cross-Origin-Embedder-Policy':'require-corp'
};
export default defineConfig({server:{headers:isolationHeaders},preview:{headers:isolationHeaders},worker:{format:'es'}});
