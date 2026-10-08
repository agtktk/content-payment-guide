import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {load} from 'cheerio';
const base=process.env.QA_URL||'http://127.0.0.1:4321';
mkdirSync('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},permissions:['clipboard-read','clipboard-write']});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const report=[];
const sitemap=load(await (await fetch(base+'/sitemap.xml')).text(),{xmlMode:true});
const paths=[...sitemap('loc').toArray().map(e=>new URL(sitemap(e).text()).pathname),'/search/'];
const articleCount=paths.filter(p=>p.startsWith('/articles/')&&p!=='/articles/').length;
for(const width of [390,1440]){
 await page.setViewportSize({width,height:width===390?844:1000});
 for(const path of paths){const response=await page.goto(base+path);assert.equal(response.status(),200,path);await page.locator('h1').waitFor();const metrics=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,barVisible:getComputedStyle(document.querySelector('.floating-contact')).display!=='none'}));assert(metrics.scroll<=metrics.width,`Overflow ${width} ${path}: ${metrics.scroll}`);assert.equal(metrics.h1,1);assert.equal(metrics.barVisible,width===390);report.push({width,path,...metrics});}
 await page.goto(base+'/');await page.screenshot({path:`artifacts/home-${width}.png`,fullPage:true});
}
await page.goto(base+'/search/?q=컨텐츠이용료현금화');assert((await page.locator('.search-item').count())>0);
await page.locator('#query').fill('존재하지않는검색어XYZ');await page.getByRole('button',{name:'검색',exact:true}).click();assert.equal(await page.locator('.search-item').count(),0);assert(await page.locator('.empty').isVisible());
await page.locator('#query').fill('<script>alert(1)</script>');await page.getByRole('button',{name:'검색',exact:true}).click();assert.equal(await page.locator('#search-results script').count(),0);
await page.getByRole('button',{name:'환불',exact:true}).click();assert((await page.locator('.search-item').count())>0);assert(await page.locator('meta[name="robots"]').getAttribute('content')==='noindex, follow');
await page.goto(base+'/contact/');await page.getByRole('button',{name:'누티켓 카카오톡 ID 복사'}).click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'N1348');
assert.equal(await page.locator('.contact-card a[href^="tel:"]').getAttribute('href'),'tel:01081111555');
assert.equal(await page.locator('.contact-card .kakao').getAttribute('href'),'https://qr.kakao.com/talk/MBsKvshDmtamG2EuQNKdmPuGFJQ-');
await page.goto(base+'/articles/refund-request/');await page.locator('summary').first().click();assert(await page.locator('details').first().getAttribute('open')!==null);await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/article-390.png',fullPage:true});
await page.evaluate(()=>document.documentElement.style.fontSize='200%');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const staticPage=await nojs.newPage();await staticPage.goto(base+'/articles/refund-request/');assert((await staticPage.locator('#answer').textContent()).includes('환불'));await staticPage.goto(base+'/search/');assert.equal(await staticPage.locator('.search-item').count(),articleCount);await nojs.close();
await page.goto(base+'/does-not-exist/');assert(await page.getByRole('heading',{name:'찾으시는 페이지가 없어요'}).isVisible());
assert.deepEqual(errors,[]);writeFileSync('artifacts/browser-qa.json',JSON.stringify({base,checkedAt:new Date().toISOString(),report,interactions:'Search aliases, empty state, safe text, suggested query, copy ID, phone/kakao links, FAQ, 200% font, no-JS content and 404',errors},null,2));
await browser.close();console.log(`PASS: ${report.length} route/viewport checks, 390px overflow, contact links & copy, search states, FAQ, 200% text, no-JS and 404.`);
