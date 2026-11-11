import {mkdirSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const projectRoot=fileURLToPath(new URL('../',import.meta.url));
// fs.cpSync replaces existing files by unlinking them first. A concurrent Vite
// server can observe that unlink without re-adding the public-file entry.
// Keep unchanged files intact, and update changed contents without unlinking.
function copyChanged(source,destination){
 const contents=readFileSync(source);
 try{if(readFileSync(destination).equals(contents))return false;}catch(error){if(error.code!=='ENOENT')throw error;}
 mkdirSync(dirname(destination),{recursive:true});
 writeFileSync(destination,contents);
 return true;
}
export function prepareAssets(root=projectRoot){
 let changed=0;
 const media=join(root,'node_modules/blockly/media');
 for(const file of readdirSync(media)){
 if(copyChanged(join(media,file),join(root,'public/blockly-media',file)))changed++;
 }
 for(const file of ['pyodide.asm.js','pyodide.asm.wasm','python_stdlib.zip','pyodide-lock.json']){
 if(copyChanged(join(root,'node_modules/pyodide',file),join(root,'public/python',file)))changed++;
 }
 return changed;
}
