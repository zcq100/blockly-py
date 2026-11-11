import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {setupResizers} from '../src/resizers.js';
import {setupWorkspaceControls} from '../src/workspace-controls.js';
import {example} from '../src/examples.js';
const dom=new JSDOM('<main><div id="blockly"><button id="canvas-center"></button><button id="canvas-zoom-in"></button><button id="canvas-zoom-out"></button><button id="canvas-fit"></button></div><div id="panel-resizer"></div></main>',{url:'http://localhost',pretendToBeVisual:true});
for(const name of ['window','document','Element','HTMLElement','SVGElement','Node','FocusEvent','DOMParser','XMLSerializer','localStorage'])globalThis[name]=dom.window[name];
globalThis.matchMedia=()=>({matches:false});
globalThis.ResizeObserver=class{observe(){}};
// JSDOM has no rendering engine; supply only the SVG measurement hooks.
dom.window.SVGElement.prototype.getBBox=function(){return {x:0,y:0,width:80,height:24};};
dom.window.HTMLCanvasElement.prototype.getContext=()=>({measureText:text=>({width:String(text).length*8})});
const Blockly=await import('blockly');
await import('blockly/blocks');
const {pythonGenerator}=await import('blockly/python');
test('Real Blockly toolbox initializes with resizers and still loads programs',()=>{
 const host=document.querySelector('#blockly'),main=document.querySelector('main');
 Object.defineProperty(host,'clientWidth',{value:700});
 Object.defineProperty(main,'clientWidth',{value:1200});
 host.getBoundingClientRect=()=>({left:0,right:700});
 main.getBoundingClientRect=()=>({left:0,right:1200});
 const workspace=Blockly.inject(host,{toolbox:{kind:'categoryToolbox',contents:[{kind:'category',name:'文本',contents:[{kind:'block',type:'text_print'}]}]},sounds:false});
 try{
 // Use the installed Blockly implementation, without mocking its toolbox DOM.
 assert.ok(workspace.getToolbox().HtmlDiv.classList.contains('blocklyToolbox'));
 setupWorkspaceControls(workspace);
 const category=host.querySelector('.blocklyToolboxCategory');
 assert.ok(category.style.getPropertyValue('--category-colour'));
 host.dispatchEvent(new dom.window.Event('pointerenter'));
 assert.ok(host.classList.contains('canvas-pointer-inside'));
 category.parentElement.focus();
 host.dispatchEvent(new dom.window.Event('pointerleave'));
 assert.ok(!host.classList.contains('canvas-pointer-inside'));
 localStorage.setItem('blockpy-layout',JSON.stringify({rightRatio:.4,toolboxWidth:88}));
 setupResizers(workspace,()=>Blockly.svgResize(workspace));
 assert.equal(workspace.getToolbox().HtmlDiv.style.width,'64px');
 assert.ok(host.querySelector('.toolbox-resizer'));
 const handle=host.querySelector('.toolbox-resizer');
 handle.setPointerCapture=()=>{};handle.hasPointerCapture=()=>false;
 const pointer=(type,x)=>handle.dispatchEvent(new dom.window.MouseEvent(type,{bubbles:true,button:0,clientX:x}));
 pointer('pointerdown',100);pointer('pointermove',180);pointer('pointerup',180);
 assert.equal(workspace.getToolbox().HtmlDiv.style.width,'180px');
 assert.equal(JSON.parse(localStorage.getItem('blockpy-layout')).layoutVersion,2);
 pointer('pointerdown',180);pointer('pointermove',0);pointer('pointerup',0);
 assert.equal(workspace.getToolbox().HtmlDiv.style.width,'56px');
 handle.dispatchEvent(new dom.window.MouseEvent('dblclick'));
 assert.equal(workspace.getToolbox().HtmlDiv.style.width,'64px');
 for(const name of ['hello','sum','branch']){
 Blockly.serialization.workspaces.load(example(name),workspace);
 assert.ok(workspace.getAllBlocks(false).length>0);
 assert.match(pythonGenerator.workspaceToCode(workspace),/print\(/);
 }
 }finally{workspace.dispose();dom.window.close();}
});
