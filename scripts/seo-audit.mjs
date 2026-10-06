import {chromium} from 'playwright';
import {load} from 'cheerio';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.QA_URL||'https://content-payment-guide.pages.dev';
const canonicalOrigin='https://content-payment-guide.pages.dev';
const sitemapResponse=await fetch(base+'/sitemap.xml');
assert.equal(sitemapResponse.status,200);
const xml=load(await sitemapResponse.text(),{xmlMode:true});
const paths=xml('loc').toArray().map(e=>new URL(xml(e).text()).pathname);
const browser=await chromium.launch();
const page=await browser.newPage();
const results=[];
try {
 for(const path of [...paths,'/search/']){
  const response=await page.goto(base+path);
  assert.equal(response.status(),200,path);
  const row=await page.evaluate(()=>({path:location.pathname,title:document.title,canonical:document.querySelector('link[rel="canonical"]')?.href,robots:document.querySelector('meta[name="robots"]')?.content,h1:[...document.querySelectorAll('h1')].map(e=>e.textContent.trim()),schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(e=>JSON.parse(e.textContent)),links:[...document.querySelectorAll('a[href]')].map(e=>({href:e.href,text:e.textContent.trim()})),headings:[...document.querySelectorAll('main h1,main h2,main h3,main h4')].map(e=>Number(e.tagName.slice(1)))}));
  assert.equal(row.h1.length,1,path);assert.equal(row.canonical,canonicalOrigin+path,path);
  const noindex=path==='/search/';assert.equal(row.robots.includes('noindex'),noindex,path);
  assert.equal((response.headers()['x-robots-tag']||'').includes('noindex'),noindex&&base===canonicalOrigin,path);
  row.headings.forEach((level,i)=>{if(i)assert(level<=row.headings[i-1]+1,'Skipped heading '+path);});
  const article=row.schemas.find(s=>s['@type']==='Article');
  if(article)assert.equal(article.headline.replace(/\s/g,''),row.h1[0].replace(/\s/g,''),'Article headline '+path);
  assert(row.schemas.some(s=>['WebPage','CollectionPage','AboutPage','ContactPage'].includes(s['@type'])),path);
  results.push(row);
 }
 const reached=new Set(['/']);let frontier=['/'];let depth=0;
 while(frontier.length){const next=[];for(const path of frontier){for(const link of results.find(r=>r.path===path)?.links||[]){const u=new URL(link.href);if(u.origin===new URL(base).origin&&paths.includes(u.pathname)&&!reached.has(u.pathname)){reached.add(u.pathname);next.push(u.pathname);}}}if(next.length)depth++;frontier=next;}
 assert.equal(reached.size,paths.length,'Orphan pages in site-navigation link graph');
 assert(depth<=3,'Important pages require more than three clicks');
 const missing=await page.goto(base+'/seo-audit-missing-page/');assert.equal(missing.status(),404);
 const robots=await (await fetch(base+'/robots.txt')).text();assert(robots.includes(canonicalOrigin+'/sitemap.xml'));assert(!/Disallow:\s*\/(?:\s|$)/m.test(robots));
 const report={checkedAt:new Date().toISOString(),base,indexablePages:paths.length,maxNavigationDepth:depth,articleCount:results.filter(r=>r.path.startsWith('/articles/')&&r.path!='/articles/').length,results};
 mkdirSync('artifacts',{recursive:true});writeFileSync('artifacts/seo-audit.json',JSON.stringify(report,null,2));
 console.log(`PASS: ${paths.length} indexable URLs; rendered metadata/schema/headings; no orphan pages; site-navigation depth ${depth}; search noindex; missing page 404; robots allows crawling.`);
} finally {await browser.close();}

