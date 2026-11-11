export function setupWorkspaceControls(workspace){
 const host=document.querySelector('#blockly');
 // Focus stays inside Blockly after a click; only pointer presence reveals bars.
 const enter=()=>host.classList.add('canvas-pointer-inside');
 const leave=()=>host.classList.remove('canvas-pointer-inside');
 host.addEventListener('pointerenter',enter);
 host.addEventListener('pointerleave',leave);
 host.addEventListener('mouseenter',enter);
 host.addEventListener('mouseleave',leave);
 window.addEventListener('blur',leave);
 // Read the installed Blockly category DOM through its public toolbox API.
 for(const item of workspace.getToolbox().getToolboxItems()){
 const row=item.getDiv?.()?.querySelector('.blocklyToolboxCategory');
 if(row)row.style.setProperty('--category-colour',row.style.borderLeftColor||'#acb4bf');
 }
 const actions={
 'canvas-center':()=>workspace.scrollCenter(),
 'canvas-zoom-in':()=>workspace.zoomCenter(1),
 'canvas-zoom-out':()=>workspace.zoomCenter(-1),
 'canvas-fit':()=>{if(workspace.getAllBlocks(false).length)workspace.zoomToFit();else workspace.scrollCenter();}
 };
 for(const [id,action] of Object.entries(actions)){
 const button=document.getElementById(id);
 button.addEventListener('pointerdown',event=>event.stopPropagation());
 button.addEventListener('click',event=>{event.stopPropagation();action();});
 }
 // Retain Blockly's trash drop target and animation, adding a light key surface.
 const trash=host.querySelector('.blocklyTrash');
 if(trash){
 const circle=document.createElementNS('http://www.w3.org/2000/svg','circle');
 circle.setAttribute('cx','23.5');circle.setAttribute('cy','30');circle.setAttribute('r','20');
 circle.setAttribute('class','canvas-trash-backdrop');
 trash.insertBefore(circle,trash.firstChild);
 const glyph=document.createElementNS('http://www.w3.org/2000/svg','g');
 glyph.setAttribute('transform','translate(12.5,19)');
 glyph.setAttribute('class','canvas-trash-glyph');
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');
 path.setAttribute('d','M3 6h16M8 6V3h6v3M5 6l1 14h10l1-14M9 10v6m4-6v6');
 path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');
 path.setAttribute('stroke-width','1.6');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');
 glyph.append(path);trash.append(glyph);
 const title=document.createElementNS('http://www.w3.org/2000/svg','title');
 title.textContent='拖入积木删除，点击查看回收站';trash.append(title);
 }
}
