const TOOLBOX_MIN=56;
const TOOLBOX_DEFAULT=64;
const TOOLBOX_MAX=240;
const clamp=(value,min,max)=>Math.min(Math.max(value,min),Math.max(min,max));
export function setupResizers(workspace,resize){
 const main=document.querySelector('main');
 const host=document.querySelector('#blockly');
 const toolbox=workspace.getToolbox()?.HtmlDiv;
 const panelHandle=document.querySelector('#panel-resizer');
 const toolHandle=document.createElement('div');
 toolHandle.className='resize-handle toolbox-resizer';
 toolHandle.tabIndex=0;
 toolHandle.setAttribute('role','separator');
 toolHandle.setAttribute('aria-label','调整积木工具箱宽度');
 toolHandle.setAttribute('aria-orientation','vertical');
 toolHandle.title='拖动调整工具箱宽度，双击恢复默认';
 if(toolbox)host.append(toolHandle);
 let settings={layoutVersion:2,rightRatio:1/2.65,toolboxWidth:TOOLBOX_DEFAULT};
 const defaults={...settings};
 try{
 const saved=JSON.parse(localStorage.getItem('blockpy-layout'));
 if(Number.isFinite(saved?.rightRatio))settings.rightRatio=clamp(saved.rightRatio,.05,.95);
 if(saved?.layoutVersion===2&&Number.isFinite(saved.toolboxWidth))settings.toolboxWidth=clamp(saved.toolboxWidth,TOOLBOX_MIN,TOOLBOX_MAX);
 }catch{/* Browser storage is optional. */}
 const save=()=>{try{localStorage.setItem('blockpy-layout',JSON.stringify(settings));}catch{}};
 const narrow=()=>matchMedia('(max-width:760px)').matches;
 function aria(handle,value,min,max){
 handle.setAttribute('aria-valuemin',String(Math.round(min)));
 handle.setAttribute('aria-valuemax',String(Math.round(max)));
 handle.setAttribute('aria-valuenow',String(Math.round(value)));
 }
 function updateToolbox(){
 if(!toolbox)return;
 const max=Math.max(TOOLBOX_MIN,Math.min(TOOLBOX_MAX,host.clientWidth*.4));
 const width=clamp(settings.toolboxWidth,TOOLBOX_MIN,max);
 toolbox.style.width=`${width}px`;
 toolHandle.style.left=`${width-4}px`;
 aria(toolHandle,width,TOOLBOX_MIN,max);
 // Blockly measures the DOM width in position(), then repositions its flyout.
 workspace.getToolbox().position();
 resize();
 }
 function updatePanels(){
 if(!narrow()){
 const available=Math.max(0,main.clientWidth-12);
 const max=Math.max(280,available-350);
 const width=clamp(available*settings.rightRatio,280,max);
 main.style.setProperty('--right-panel-width',`${width}px`);
 aria(panelHandle,width,280,max);
 }
 }
 function bind(handle,update,reset){
 let dragging=false;
 function end(event){
 if(!dragging)return;
 dragging=false;handle.classList.remove('dragging');
 document.body.classList.remove('resizing-panels');
 if(handle.hasPointerCapture?.(event.pointerId))handle.releasePointerCapture(event.pointerId);
 save();
 }
 handle.addEventListener('pointerdown',event=>{
 if(event.button!==0)return;
 event.preventDefault();event.stopPropagation();
 dragging=true;handle.setPointerCapture(event.pointerId);
 handle.classList.add('dragging');document.body.classList.add('resizing-panels');
 });
 handle.addEventListener('pointermove',event=>{
 if(!dragging)return;
 event.preventDefault();update(event.clientX);
 });
 handle.addEventListener('pointerup',end);
 handle.addEventListener('pointercancel',end);
 handle.addEventListener('lostpointercapture',end);
 handle.addEventListener('dblclick',()=>{reset();save();});
 handle.addEventListener('keydown',event=>{
 if(!['ArrowLeft','ArrowRight','Home'].includes(event.key))return;
 event.preventDefault();
 if(event.key==='Home')reset();
 else update(handle.getBoundingClientRect().left+handle.getBoundingClientRect().width/2+(event.key==='ArrowLeft'?-16:16));
 save();
 });
 }
 bind(toolHandle,x=>{
 settings.toolboxWidth=clamp(x-host.getBoundingClientRect().left,TOOLBOX_MIN,Math.min(TOOLBOX_MAX,host.clientWidth*.4));
 updateToolbox();
 },()=>{settings.toolboxWidth=defaults.toolboxWidth;updateToolbox();});
 bind(panelHandle,x=>{
 const available=main.clientWidth-12;
 if(narrow()||available<=0)return;
 const width=clamp(main.getBoundingClientRect().right-x-6,280,available-350);
 settings.rightRatio=width/available;
 updatePanels();
 },()=>{settings.rightRatio=defaults.rightRatio;updatePanels();});
 new ResizeObserver(updatePanels).observe(main);
 new ResizeObserver(updateToolbox).observe(host);
 updatePanels();updateToolbox();
}
