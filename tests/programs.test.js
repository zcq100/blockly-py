import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import {pythonGenerator} from 'blockly/python';
import {loadPyodide} from 'pyodide';
import {example,exampleCatalog} from '../src/examples.js';
const python=await loadPyodide();
const expectedOutputs={
 hello:'你好，Python！\n用积木，让想法变成现实。\n用积木，让想法变成现实。\n用积木，让想法变成现实。',
 sum:'55',branch:'这是奇数',
 greeting:'你好，小明！欢迎来到积木工坊。',
 countdown:'5\n4\n3\n2\n1\n发射！',
 multiplication:Array.from({length:9},(_,row)=>Array.from({length:row+1},(_,col)=>`${col+1} × ${row+1} = ${(col+1)*(row+1)}`)).flat().join('\n'),
 shopping:'需要购买：苹果\n需要购买：牛奶\n需要购买：面包\n共 3 件商品',
 factorial:'5! = 120',
 square:'square(1) = 1\nsquare(2) = 4\nsquare(3) = 9\nsquare(4) = 16\nsquare(5) = 25'
};
for(const {id:name} of exampleCatalog){
 const expected=expectedOutputs[name];
 test(`${name}: Blockly serialization, Python generation, and execution`,async()=>{
 const ws=new Blockly.Workspace();
 Blockly.serialization.workspaces.load(example(name),ws);
 const code=pythonGenerator.workspaceToCode(ws);
 assert.ok(code.includes('print('));
 const restored=new Blockly.Workspace();
 Blockly.serialization.workspaces.load(Blockly.serialization.workspaces.save(ws),restored);
 assert.equal(pythonGenerator.workspaceToCode(restored),code);
 const lines=[];
 python.setStdout({batched:t=>lines.push(t)});
 const globals=python.toPy({});
 try{
 if(name==='greeting')await python.runPythonAsync("def input(prompt=''):\n    return '小明'",{globals});
 await python.runPythonAsync(code,{globals});
 }finally{globals.destroy();}
 assert.equal(lines.join('\n'),expected);
 ws.dispose();restored.dispose();
 });
}
