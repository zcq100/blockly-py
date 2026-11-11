import {Names} from 'blockly';
import {PythonGenerator,pythonGenerator as standardGenerator} from 'blockly/python';

// Python 3 accepts Unicode identifiers. Blockly's generic name encoder targets
// ASCII languages, which turns Chinese labels into unreadable _E5_... sequences.
const identifier=/^[_\p{XID_Start}][_\p{XID_Continue}]*$/u;
function readableName(value){
 const normalized=String(value||'variable').normalize('NFKC').trim();
 if(identifier.test(normalized))return normalized;
 let name=normalized.replace(/[^_\p{XID_Continue}]+/gu,'_');
 if(!name||/^_+$/.test(name))name='variable';
 if(!/^[_\p{XID_Start}]/u.test(name))name='var_'+name;
 return name;
}
class PythonNames extends Names{
 constructor(reserved){
 super(reserved);
 this.reserved=new Set(reserved.split(','));
 this.used=new Set();
 }
 reset(){super.reset();this.used.clear();}
 // Use the public allocation hook; keep Blockly's variable-ID and procedure
 // mappings intact, without patching private methods or replacing code text.
 getDistinctName(value){
 let base=readableName(value);
 if(this.reserved.has(base))base+='_';
 let candidate=base,index=2;
 while(this.used.has(candidate)||this.reserved.has(candidate)){
 candidate=`${base}${base.endsWith('_')?'':'_'}${index++}`;
 }
 this.used.add(candidate);
 return candidate;
 }
}
class ReadablePythonGenerator extends PythonGenerator{
 constructor(){
 super();
 Object.assign(this.forBlock,standardGenerator.forBlock);
 this.addReservedWords('async,await');
 }
 init(workspace){
 this.nameDB_=new PythonNames(this.RESERVED_WORDS_);
 super.init(workspace);
 }
}
export const pythonGenerator=new ReadablePythonGenerator();
