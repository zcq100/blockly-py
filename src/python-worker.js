import {loadPyodide} from 'pyodide';
self.onmessage=async({data})=>{
 try{
 const py=await loadPyodide({indexURL:`${self.location.origin}/python/`});
 let lines=0;
 py.setStdout({batched:text=>{if(lines++<1000)self.postMessage({type:'output',text});else if(lines===1002)self.postMessage({type:'output',text:'…输出超过 1000 行，后续内容已省略。'});}});
 py.setStderr({batched:text=>self.postMessage({type:'output',text})});
 self.postMessage({type:'ready'});
 py.globals.set('_blockpy_read',()=>{
 const control=new Int32Array(data.inputBuffer,0,2);
 Atomics.store(control,0,0);
 self.postMessage({type:'input'});
 Atomics.wait(control,0,0);
 return new TextDecoder().decode(new Uint8Array(data.inputBuffer,8,Atomics.load(control,1)));
 });
 await py.runPythonAsync(`import builtins\ndef _blockpy_input(prompt=''):\n    if prompt: print(prompt)\n    return _blockpy_read()\nbuiltins.input = _blockpy_input`);
 await py.runPythonAsync(data.code);
 self.postMessage({type:'done'});
 }catch(e){self.postMessage({type:'error',text:String(e)});}
};
