export function setupExamplePicker(root,onSelect){
 const buttons=[...root.querySelectorAll('[data-example]')];
 const summary=root.querySelector('summary');
 const label=root.querySelector('#example-current');
 for(const button of buttons){
 button.addEventListener('click',()=>{
 if(onSelect(button.dataset.example)!==false){
 label.textContent=button.textContent;
 for(const option of buttons)option.setAttribute('aria-pressed',String(option===button));
 }
 root.open=false;summary.focus();
 });
 }
 document.addEventListener('pointerdown',event=>{if(!root.contains(event.target))root.open=false;});
 root.addEventListener('keydown',event=>{
 if(event.key==='Escape'){event.preventDefault();root.open=false;summary.focus();}
 if(event.key==='ArrowDown'||event.key==='ArrowUp'){
 event.preventDefault();root.open=true;
 const index=buttons.indexOf(document.activeElement);
 const next=index<0?(event.key==='ArrowDown'?0:buttons.length-1):(index+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
 buttons[next].focus();
 }
 });
 root.addEventListener('focusout',event=>{if(!root.contains(event.relatedTarget))root.open=false;});
}
