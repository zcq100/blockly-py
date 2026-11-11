import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,statSync,readFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {prepareAssets} from '../scripts/prepare-assets.mjs';
test('Repeated asset preparation preserves runtime files and updates in place',()=>{
 const root=mkdtempSync(join(tmpdir(),'blockpy-assets-'));
 try{
 mkdirSync(join(root,'node_modules/pyodide'),{recursive:true});
 mkdirSync(join(root,'node_modules/blockly/media'),{recursive:true});
 writeFileSync(join(root,'node_modules/blockly/media/sprites.svg'),'<svg/>');
 for(const file of ['pyodide.asm.js','pyodide.asm.wasm','python_stdlib.zip','pyodide-lock.json'])writeFileSync(join(root,'node_modules/pyodide',file),file==='pyodide-lock.json'?'{"info":{"version":"test"}}':'fixture');
 assert.equal(prepareAssets(root),5);
 const manifest=join(root,'public/python/pyodide-lock.json');
 const before=statSync(manifest,{bigint:true});
 assert.equal(prepareAssets(root),0);
 const unchanged=statSync(manifest,{bigint:true});
 assert.equal(unchanged.ino,before.ino);
 assert.equal(unchanged.mtimeNs,before.mtimeNs);
 writeFileSync(join(root,'node_modules/pyodide/pyodide-lock.json'),'{"info":{"version":"updated"}}');
 assert.equal(prepareAssets(root),1);
 assert.equal(statSync(manifest,{bigint:true}).ino,before.ino);
 assert.equal(JSON.parse(readFileSync(manifest)).info.version,'updated');
 }finally{rmSync(root,{recursive:true,force:true});}
});
