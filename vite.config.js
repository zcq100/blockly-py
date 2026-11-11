import {defineConfig} from 'vite';
import {cpSync,mkdirSync} from 'node:fs';
// Serve Blockly icons, cursors and sounds locally in development and builds.
cpSync('node_modules/blockly/media','public/blockly-media',{recursive:true});
// Keep the Python runtime local: no CDN dependency at run time.
mkdirSync('public/python',{recursive:true});
for(const file of ['pyodide.asm.js','pyodide.asm.wasm','python_stdlib.zip','pyodide-lock.json']) cpSync(`node_modules/pyodide/${file}`,`public/python/${file}`);
export default defineConfig({server:{headers:{'Cross-Origin-Opener-Policy':'same-origin','Cross-Origin-Embedder-Policy':'require-corp'}},preview:{headers:{'Cross-Origin-Opener-Policy':'same-origin','Cross-Origin-Embedder-Policy':'require-corp'}},worker:{format:'es'}});
