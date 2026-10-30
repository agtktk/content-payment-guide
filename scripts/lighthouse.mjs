import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {chromium} from 'playwright';
const phase=process.argv[2]||'after';
if(!/^[a-z0-9-]+$/.test(phase))throw new Error('Use an alphanumeric report phase');
const selected=process.argv[3]?.split(',');
const origin=process.env.QA_URL||'https://content-payment-guide.pages.dev';
const out=path.resolve('artifacts/lighthouse-2026-10-30',phase);fs.mkdirSync(out,{recursive:true});
const results=[];
for(const [page,route] of [['home','/'],['article','/articles/cashout-meaning/']])for(const device of ['mobile','desktop']){
 const name=page+'-'+device;if(selected&&!selected.includes(name))continue;
 const reportPath=path.join(out,name);
 const args=['exec','--yes','--package=lighthouse@13.6.0','--','lighthouse',new URL(route,origin).href,'--chrome-flags=--headless --no-sandbox --disable-extensions','--only-categories=performance,accessibility,best-practices,seo','--output=json','--output=html','--output-path='+reportPath,'--quiet'];
 if(device==='desktop')args.push('--preset=desktop');
 const r=spawnSync(process.execPath,[process.env.npm_execpath,...args],{encoding:'utf8',env:{...process.env,CHROME_PATH:process.env.CHROME_PATH||chromium.executablePath()},maxBuffer:5e6});
 if(r.status!==0){console.error(r.stderr||r.stdout);process.exit(r.status||1);}
 const lhr=JSON.parse(fs.readFileSync(reportPath+'.report.json','utf8'));if(lhr.runtimeError)throw new Error(lhr.runtimeError.message);
 const result={phase,page,device,url:lhr.finalDisplayedUrl,version:lhr.lighthouseVersion,categories:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),fcp:lhr.audits['first-contentful-paint'].numericValue,lcp:lhr.audits['largest-contentful-paint'].numericValue,tbt:lhr.audits['total-blocking-time'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue};results.push(result);console.log(JSON.stringify(result));
}
fs.writeFileSync(path.join(out,'run-summary.json'),JSON.stringify(results,null,2));
