const text = value=>({type:'text',fields:{TEXT:value}});
const num = value=>({type:'math_number',fields:{NUM:value}});
const get = id=>({type:'variables_get',fields:{VAR:{id}}});
const print = block=>({type:'text_print',inputs:{TEXT:{block}}});
export const exampleCatalog=[
 {id:'hello',title:'你好，Python'},
 {id:'sum',title:'计算 1 到 10 的和'},
 {id:'branch',title:'判断奇偶数'},
 {id:'greeting',title:'输入名字，打个招呼'},
 {id:'countdown',title:'火箭发射倒计时'},
 {id:'multiplication',title:'九九乘法表'},
 {id:'shopping',title:'遍历购物清单'},
 {id:'factorial',title:'计算 5 的阶乘'},
 {id:'square',title:'函数：计算平方'}
];
const variable=(id,name=id)=>({id,name,type:''});
const set=(id,value)=>({type:'variables_set',fields:{VAR:{id}},inputs:{VALUE:{block:value}}});
const arithmetic=(op,a,b)=>({type:'math_arithmetic',fields:{OP:op},inputs:{A:{block:a},B:{block:b}}});
const join=(...blocks)=>({type:'text_join',extraState:{itemCount:blocks.length},inputs:Object.fromEntries(blocks.map((block,i)=>['ADD'+i,{block}]))});
const chain=(...blocks)=>blocks.reduceRight((next,block)=>({...block,...(next?{next:{block:next}}:{})}),null);
const forLoop=(id,from,to,body)=>({type:'controls_for',fields:{VAR:{id}},inputs:{FROM:{block:num(from)},TO:{block:typeof to==='number'?num(to):to},BY:{block:num(1)},DO:{block:body}}});
export function example(name){
 let first;
 let variables=[];
 let extraBlocks=[];
 if(name==='sum'){
 variables=[variable('total','总和'),variable('i')];
 const change={type:'math_change',fields:{VAR:{id:'total'}},inputs:{DELTA:{block:get('i')}}};
 const loop={type:'controls_for',fields:{VAR:{id:'i'}},inputs:{FROM:{block:num(1)},TO:{block:num(10)},BY:{block:num(1)},DO:{block:change}},next:{block:print(get('total'))}};
 first={type:'variables_set',fields:{VAR:{id:'total'}},inputs:{VALUE:{block:num(0)}},next:{block:loop}};
 }else if(name==='branch'){
 const modulo={type:'math_modulo',inputs:{DIVIDEND:{block:num(7)},DIVISOR:{block:num(2)}}};
 const compare={type:'logic_compare',fields:{OP:'EQ'},inputs:{A:{block:modulo},B:{block:num(0)}}};
 first={type:'controls_if',extraState:{hasElse:true},inputs:{IF0:{block:compare},DO0:{block:print(text('这是偶数'))},ELSE:{block:print(text('这是奇数'))}}};
 }else if(name==='greeting'){
 variables=[variable('name','名字')];
 first=chain(set('name',{type:'text_prompt_ext',fields:{TYPE:'TEXT'},inputs:{TEXT:{block:text('你叫什么名字？')}}}),print(join(text('你好，'),get('name'),text('！欢迎来到积木工坊。'))));
 }else if(name==='countdown'){
 variables=[variable('count','倒计时')];
 first=chain(forLoop('count',5,1,print(get('count'))),print(text('发射！')));
 }else if(name==='multiplication'){
 variables=[variable('i'),variable('j')];
 const equation=join(get('j'),text(' × '),get('i'),text(' = '),arithmetic('MULTIPLY',get('i'),get('j')));
 first=forLoop('i',1,9,forLoop('j',1,get('i'),print(equation)));
 }else if(name==='shopping'){
 variables=[variable('shopping','购物清单'),variable('item','商品')];
 const list={type:'lists_create_with',extraState:{itemCount:3},inputs:{ADD0:{block:text('苹果')},ADD1:{block:text('牛奶')},ADD2:{block:text('面包')}}};
 first=chain(set('shopping',list),{type:'controls_forEach',fields:{VAR:{id:'item'}},inputs:{LIST:{block:get('shopping')},DO:{block:print(join(text('需要购买：'),get('item')))}}},print(join(text('共 '),{type:'lists_length',inputs:{VALUE:{block:get('shopping')}}},text(' 件商品'))));
 }else if(name==='factorial'){
 variables=[variable('result','阶乘'),variable('i')];
 first=chain(set('result',num(1)),forLoop('i',1,5,set('result',arithmetic('MULTIPLY',get('result'),get('i')))),print(join(text('5! = '),get('result'))));
 }else if(name==='square'){
 variables=[variable('x'),variable('i')];
 first={type:'procedures_defreturn',fields:{NAME:'square'},extraState:{params:[{name:'x',id:'x'}]},inputs:{RETURN:{block:arithmetic('MULTIPLY',get('x'),get('x'))}}};
 const call={type:'procedures_callreturn',extraState:{name:'square',params:['x']},inputs:{ARG0:{block:get('i')}}};
 extraBlocks=[{...forLoop('i',1,5,print(join(text('square('),get('i'),text(') = '),call))),x:48,y:240}];
 }else{
 const repeat={type:'controls_repeat_ext',inputs:{TIMES:{block:num(3)},DO:{block:print(text('用积木，让想法变成现实。'))}}};
 first={...print(text('你好，Python！')),next:{block:repeat}};
 }
 return {blocks:{languageVersion:0,blocks:[{...first,x:48,y:48},...extraBlocks]},variables};
}
