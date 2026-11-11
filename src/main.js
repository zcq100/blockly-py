import * as Blockly from 'blockly';
import 'blockly/blocks';
import * as Zh from 'blockly/msg/zh-hans';
import {pythonGenerator} from './python-generator.js';
import './style.css';
import {setupResizers} from './resizers.js';
import {setupWorkspaceControls} from './workspace-controls.js';
import {setupExamplePicker} from './example-picker.js';
import {studioTheme,palette} from './theme.js';
import {example,exampleCatalog} from './examples.js';
import {version as appVersion} from '../package.json';
Blockly.setLocale(Zh);
const $ = s => document.querySelector(s);
const icon = name => {
 const paths = {
 blocks:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 play:'<path d="m8 5 11 7-11 7Z"/>',stop:'<rect x="6" y="6" width="12" height="12" rx="1"/>',
 undo:'<path d="M9 5 4 10l5 5M4 10h9a7 7 0 0 1 7 7"/>',redo:'<path d="m15 5 5 5-5 5m5-5h-9a7 7 0 0 0-7 7"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',center:'<circle cx="12" cy="12" r="6"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>',fit:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
 copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',eraser:'<path d="m15 3 6 6-11 11H6l-4-4L15 3ZM7 11l6 6m-3 3h11"/>',repo:'<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M6 7v10m12-10v3a3 3 0 0 1-3 3H9a3 3 0 0 0-3 3"/>',
 code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-5 3 2-18"/>',
 save:'<path d="M5 3h12l4 4v14H3V3h2Zm2 0v6h10V3M7 21v-8h10v8"/>',
 folder:'<path d="M3 7V4h6l3 3h9v13H3V7Z"/>',terminal:'<path d="m4 6 6 6-6 6m9 0h7"/>'
 };
 return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||''}</svg>`;
};
$('#app').innerHTML = `
<header><a class="brand" href="/">${icon('blocks')}<span>积木工坊</span></a><div class="project"><input id="name" aria-label="作品名称" value="我的第一个 Python 程序"></div><details id="examples" class="example-picker"><summary aria-label="选择示例程序" title="选择示例程序"><span id="example-current">你好，Python</span><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></summary><div class="example-options">${exampleCatalog.map(({id,title})=>`<button type="button" data-example="${id}" aria-pressed="${id==='hello'}">${title}</button>`).join('')}</div></details><div class="file-actions"><button id="export-project">${icon('save')}保存</button><button id="import-project">${icon('folder')}打开</button><input type="file" id="file" accept=".json" hidden></div><div class="transport"><div class="icon-group" role="group" aria-label="运行控制"><button class="run" id="run" title="运行程序" aria-label="运行程序">${icon('play')}</button><button id="stop" title="停止运行" aria-label="停止运行" disabled>${icon('stop')}</button></div></div></header>

<main><section class="workspace-panel"><div class="panel-head"><strong><span class="panel-number">01</span> 积木工作区</strong><div class="workspace-actions"><button id="undo" class="round-action" title="撤销" aria-label="撤销">${icon('undo')}</button><button id="redo" class="round-action" title="重做" aria-label="重做">${icon('redo')}</button><span class="action-divider" aria-hidden="true"></span><button id="clear" title="清空积木工作区">${icon('trash')}清空</button></div></div><div id="blockly"><div class="canvas-controls" role="group" aria-label="画板视图操作"><button id="canvas-center" title="居中积木" aria-label="居中积木">${icon('center')}</button><button id="canvas-zoom-in" title="放大" aria-label="放大">${icon('plus')}</button><button id="canvas-zoom-out" title="缩小" aria-label="缩小">${icon('minus')}</button><button id="canvas-fit" title="适应全部积木" aria-label="适应全部积木">${icon('fit')}</button></div></div><div class="workspace-foot"><span>从左侧分类中拖出积木，连接后组成程序</span><span id="count">0 个积木</span></div></section>
<div id="panel-resizer" class="resize-handle panel-resizer" role="separator" aria-label="调整右侧面板宽度" aria-orientation="vertical" tabindex="0" title="拖动调整宽度，双击恢复默认"></div><aside><section class="code-panel"><div class="panel-head"><strong><span class="panel-number">02</span> Python 代码</strong><div class="icon-group" role="group" aria-label="代码操作"><button id="copy" title="复制 Python 代码" aria-label="复制 Python 代码">${icon('copy')}</button><button id="download" title="导出 Python 文件" aria-label="导出 Python 文件">${icon('download')}</button></div></div><pre id="code" tabindex="0" aria-label="生成的 Python 代码"></pre><div class="code-foot">Python 3 · 根据积木实时生成</div></section><section class="console-panel"><div class="panel-head"><strong><span class="panel-number">03</span> 运行终端</strong><button id="clear-output" class="icon-only" title="清除输出" aria-label="清除输出">${icon('eraser')}</button></div><div id="terminal" role="log" aria-live="polite"><p class="muted">点击顶部运行按钮查看结果</p></div><form id="input-form" hidden><label for="stdin">程序输入</label><input id="stdin" autocomplete="off" placeholder="输入内容后按回车"><button>发送</button></form><div class="console-foot"><span id="status">● 就绪</span><span>Python / 本地运行</span></div></section></aside></main><footer><div class="footer-meta"><a href="https://github.com/zcq100/blockly-py" target="_blank" rel="noopener noreferrer" title="查看 GitHub 仓库">${icon('repo')}<span>GitHub</span></a><span class="footer-version">v${appVersion}</span></div><span class="keyboard-hints">滚轮缩放 · 拖动画布 · Delete 删除积木</span></footer><div id="toast" role="status"></div>`;
const toolbox = {kind:'categoryToolbox',contents:[
{name:'文本',colour:palette.cyan,blocks:['text','text_print','text_join','text_length','text_prompt_ext']},
{name:'逻辑',colour:palette.blue,blocks:['controls_if','logic_compare','logic_operation','logic_negate','logic_boolean']},
{name:'循环',colour:palette.orange,blocks:['controls_repeat_ext','controls_whileUntil','controls_for','controls_forEach','controls_flow_statements']},
{name:'数学',colour:palette.green,blocks:['math_number','math_arithmetic','math_modulo','math_random_int','math_single']},
{name:'列表',colour:palette.purple,blocks:['lists_create_with','lists_length','lists_getIndex','lists_setIndex']},
{kind:'sep'}, {kind:'category',name:'变量',colour:palette.cyan,custom:'VARIABLE'}, {kind:'category',name:'函数',colour:palette.purple,custom:'PROCEDURE'}
].map(c=>c.blocks?{kind:'category',name:c.name,colour:c.colour,contents:c.blocks.map(type=>({kind:'block',type}))}:c)};
const workspace = Blockly.inject('blockly',{media:`${import.meta.env.BASE_URL}blockly-media/`,toolbox,theme:studioTheme,renderer:'zelos',grid:{spacing:24,length:2,colour:'#435166',snap:true},trashcan:true,zoom:{controls:false,wheel:true,startScale:0.95,minScale:0.4,maxScale:1.6},move:{scrollbars:true,drag:true,wheel:true}});
new ResizeObserver(()=>Blockly.svgResize(workspace)).observe($('#blockly'));

let code=''; let saveTimer; let loading=false;
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');setTimeout(()=>$('#toast').classList.remove('visible'),2500);}
function persist(){try{localStorage.setItem('blockpy-project',JSON.stringify({name:$('#name').value,workspace:Blockly.serialization.workspaces.save(workspace)}));}catch{toast('保存失败，请导出作品');}}
workspace.addChangeListener(event=>{if(event.isUiEvent)return;code=pythonGenerator.workspaceToCode(workspace);$('#code').textContent=code||'# 拖入积木，开始你的 Python 程序';$('#count').textContent=`${workspace.getAllBlocks(false).length} 个积木`;if(!loading){clearTimeout(saveTimer);saveTimer=setTimeout(persist,350);}});
function load(state){loading=true;try{Blockly.serialization.workspaces.load(state,workspace);}finally{loading=false;}workspace.scrollCenter();}
try{const saved=JSON.parse(localStorage.getItem('blockpy-project'));if(saved?.workspace){load(saved.workspace);$('#name').value=saved.name||'未命名作品';}else load(example('hello'));}catch{load(example('hello'));}
$('#name').addEventListener('input',persist);
setupExamplePicker($('#examples'),name=>{if(!confirm('载入示例将替换当前积木，是否继续？'))return false;load(example(name));persist();return true;});
$('#clear').onclick=()=>{if(confirm('确定清空工作区？可以通过撤销恢复。'))workspace.clear();};
$('#undo').onclick=()=>workspace.undo(false);$('#redo').onclick=()=>workspace.undo(true);
function download(content,name,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('#download').onclick=()=>download(code,`${$('#name').value||'program'}.py`,'text/x-python');
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(code);toast('Python 代码已复制');}catch{toast('无法访问剪贴板，请选中代码复制');}};
$('#export-project').onclick=()=>download(JSON.stringify({version:1,name:$('#name').value,workspace:Blockly.serialization.workspaces.save(workspace)},null,2),`${$('#name').value||'project'}.json`,'application/json');
$('#import-project').onclick=()=>$('#file').click();
$('#file').onchange=async e=>{const file=e.target.files[0];if(!file)return;const previous=Blockly.serialization.workspaces.save(workspace);try{const data=JSON.parse(await file.text());if(!data.workspace?.blocks)throw Error('invalid');load(data.workspace);$('#name').value=data.name||'导入的作品';persist();toast('作品已打开');}catch{load(previous);toast('无法打开，请选择有效的作品 JSON 文件');}e.target.value='';};
let worker=null, timeout=null, awaitingInput=false, inputBuffer=null, runningCode='';
function line(value,cls=''){const p=document.createElement('p');p.className=cls;p.textContent=value;$('#terminal').append(p);$('#terminal').scrollTop=$('#terminal').scrollHeight;}
function finish(status){clearTimeout(timeout);$('#run').disabled=false;$('#stop').disabled=true;$('#status').textContent=status;$('#input-form').hidden=true;awaitingInput=false;}
function stop(){worker?.terminate();worker=null;finish('● 已停止');}
function execute(){
 if(typeof SharedArrayBuffer==='undefined'){line('当前浏览器未启用独立运行环境。请使用 npm run dev 或 npm run preview 启动，部署时请配置 README 中的响应头。','error');finish('● 环境不可用');return;}
 worker?.terminate();worker=new Worker(new URL('./python-worker.js',import.meta.url),{type:'module'});
 $('#run').disabled=true;$('#stop').disabled=false;$('#status').textContent='● 正在启动 Python…';
 timeout=setTimeout(()=>{stop();line('运行超时（60 秒），程序已停止。','error');},60000);
 worker.onmessage=({data})=>{if(data.type==='output')line(data.text);else if(data.type==='ready')$('#status').textContent='● 运行中';else if(data.type==='input'){clearTimeout(timeout);awaitingInput=true;$('#status').textContent='● 等待输入';$('#input-form').hidden=false;$('#stdin').focus();}else if(data.type==='done'){finish('● 运行完成');line('程序运行完成','muted');worker.terminate();worker=null;}else if(data.type==='error'){line(data.text,'error');finish('● 运行出错');worker.terminate();worker=null;}};
 worker.onerror=e=>{line(e.message||'Python 环境启动失败','error');stop();};
 inputBuffer=new SharedArrayBuffer(65544);
 worker.postMessage({code:runningCode,inputBuffer});
}
$('#run').onclick=()=>{if(!code.trim()){toast('先添加一些积木吧');return;}$('#terminal').replaceChildren();runningCode=code;line('首次启动 Python 可能需要片刻…','muted');execute();};
$('#stop').onclick=()=>{stop();line('已手动停止程序','muted');};
$('#input-form').onsubmit=e=>{e.preventDefault();if(!awaitingInput)return;const bytes=new TextEncoder().encode($('#stdin').value);if(bytes.length>65536){toast('输入内容过长');return;}const control=new Int32Array(inputBuffer,0,2);new Uint8Array(inputBuffer,8).set(bytes);Atomics.store(control,1,bytes.length);Atomics.store(control,0,1);Atomics.notify(control,0);line('> '+$('#stdin').value,'muted');$('#stdin').value='';$('#input-form').hidden=true;awaitingInput=false;$('#status').textContent='● 运行中';timeout=setTimeout(()=>{stop();line('运行超时（60 秒），程序已停止。','error');},60000);};
$('#clear-output').onclick=()=>$('#terminal').replaceChildren();

setupWorkspaceControls(workspace);
setupResizers(workspace,()=>Blockly.svgResize(workspace));
