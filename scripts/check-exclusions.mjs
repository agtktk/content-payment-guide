import {writeFileSync,unlinkSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {contentEntries} from './content-utils.mjs';
const base=contentEntries()[0];const paths=[];
try{
 for(const [id,extra] of [['qa-draft-fixture',{draft:true}],['qa-future-fixture',{draft:false,publishedAt:'2099-01-01'}]]){const path=`src/content/articles/${id}.md`;paths.push(path);writeFileSync(path,`---\n${JSON.stringify({...base.data,...extra,title:id,description:'Publication exclusion integration fixture only; never public.'},null,2)}\n---\n${base.body}`);}
 const executable=process.platform==='win32'?'npm.cmd':'npm';
 const result=spawnSync(executable,['run','build'],{stdio:'inherit',shell:process.platform==='win32'});if(result.status!==0)throw new Error('Exclusion build failed');
 console.log('PASS: Real draft and future fixtures absent from routes, search, sitemap and RSS.');
}finally{for(const path of paths)unlinkSync(path);}
