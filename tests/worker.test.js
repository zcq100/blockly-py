import {Worker} from 'node:worker_threads';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
// Run the shipped worker logic with a Node message adapter and local runtime path.
const workerSource=readFileSync(new URL('../src/python-worker.js',import.meta.url),'utf8')
 .replace("from 'pyodide'",`from '${import.meta.resolve('pyodide')}'`)
 .replace('`${self.location.origin}/python/`',JSON.stringify(new URL('../node_modules/pyodide/',import.meta.url).pathname));
const adapter=`import {parentPort} from 'node:worker_threads';globalThis.self=globalThis;self.postMessage=m=>parentPort.postMessage(m);${workerSource}\nparentPort.on('message',data=>self.onmessage({data}));`;
async function run(code,input){
 const worker=new Worker(new URL(`data:text/javascript,${encodeURIComponent(adapter)}`));
 const buffer=new SharedArrayBuffer(65544);const output=[];
 try{return await new Promise((resolve,reject)=>{
 const timer=setTimeout(()=>reject(Error('worker timed out')),20000);
 worker.on('error',e=>{clearTimeout(timer);reject(e);});
 worker.on('message',m=>{
 if(m.type==='output')output.push(m.text);
 if(m.type==='input'){
 const bytes=new TextEncoder().encode(input);const control=new Int32Array(buffer,0,2);
 new Uint8Array(buffer,8).set(bytes);Atomics.store(control,1,bytes.length);Atomics.store(control,0,1);Atomics.notify(control,0);
 }
 if(m.type==='done'||m.type==='error'){clearTimeout(timer);resolve({...m,output});}
 });worker.postMessage({code,inputBuffer:buffer});
 });}finally{await worker.terminate();}
}
test('Worker accepts interactive Unicode input and resumes Python',async()=>{
 const result=await run("name = input('你的名字？')\nprint('你好，' + name)",'小明');
 assert.equal(result.type,'done');assert.deepEqual(result.output,['你的名字？','你好，小明']);
});
test('Worker returns Python errors',async()=>{
 const result=await run('print(1 / 0)');assert.equal(result.type,'error');assert.match(result.text,/ZeroDivisionError/);
});
