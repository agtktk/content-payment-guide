import {readFileSync,readdirSync,existsSync,writeFileSync} from 'node:fs';
import {join,relative} from 'node:path';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {contentEntries} from './content-utils.mjs';
import {isPublished} from '../src/lib/publication.ts';
const origin=process.env.SITE_URL||'https://content-payment-guide.pages.dev';
const preview=process.env.SITE_PREVIEW==='true'||(process.env.CF_PAGES==='1'&&process.env.CF_PAGES_BRANCH!=='main');
const walk=(dir)=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
const files=walk('dist').filter(p=>p.endsWith('.html'));const titles=new Set();const descriptions=new Set();let links=0;
const resolvePath=p=>p==='/404/'?'dist/404.html':p.endsWith('/')?join('dist',p,'index.html'):join('dist',p);
for(const file of files){
 const $=load(readFileSync(file,'utf8'));const path=relative('dist',file).replaceAll('\\','/');
 assert.equal($('h1').length,1,'H1: '+path);
 assert.equal($('html').attr('lang'),'ko');
 const title=$('title').text();assert(title);assert(!titles.has(title),'Duplicate title: '+path);titles.add(title);
 const desc=$('meta[name="description"]').attr('content');assert(desc);assert(!descriptions.has(desc),'Duplicate description: '+path);descriptions.add(desc);
 const canonical=$('link[rel="canonical"]').attr('href');assert(canonical&&new URL(canonical).origin===new URL(origin).origin,'Canonical: '+path);
 const expected=path==='404.html'?'/404/':path==='index.html'?'/':'/'+path.replace(/index\.html$/,'');assert.equal(new URL(canonical).pathname,expected);
 const noindex=$('meta[name="robots"]').attr('content')?.includes('noindex');assert.equal(noindex,preview||path==='search/index.html'||path==='404.html','Robots: '+path);
 $('script[type="application/ld+json"]').each((_,s)=>{const schemas=JSON.parse($(s).html());assert(schemas.some(s=>['WebPage','CollectionPage','AboutPage','ContactPage'].includes(s['@type'])),'Page schema: '+path);for(const schema of schemas){assert.notEqual(schema['@type'],'FAQPage');if(schema['@type']==='Article'){assert.equal(schema.headline.replace(/\s/g,''),$('h1').text().replace(/\s/g,''),'Visible headline: '+path);assert.equal(schema.mainEntityOfPage['@id'],canonical+'#webpage');assert.equal(schema.dateModified.slice(0,10),$('.article-meta time').last().attr('datetime')||'2026-10-07');}}});
 for(const el of $('a[href]').toArray()){
  const href=$(el).attr('href');
  if(href.startsWith('tel:'))assert.equal(href,'tel:01081111555');
  if($(el).attr('target')==='_blank')assert($(el).attr('rel')?.includes('noopener'));
  if(!href.startsWith('/')&&!href.startsWith('#'))continue;
  const url=new URL(href,new URL(expected,origin));const target=resolvePath(decodeURIComponent(url.pathname));assert(existsSync(target),'Broken link '+path+' → '+href);links++;
  if(url.hash){assert(target.endsWith('.html'));const targetDoc=load(readFileSync(target,'utf8'));assert(targetDoc('[id]').toArray().some(e=>targetDoc(e).attr('id')===decodeURIComponent(url.hash.slice(1))),'Broken anchor '+href);}
 }
}
const sitemap=load(readFileSync('dist/sitemap.xml','utf8'),{xmlMode:true});
const feed=load(readFileSync('dist/rss.xml','utf8'),{xmlMode:true});
const search=readFileSync('dist/search/index.html','utf8');
const articles=contentEntries();const visible=articles.filter(a=>isPublished(a.data));
assert.equal(feed('item').length,visible.length);
for(const a of articles){const url=new URL(`/articles/${a.id}/`,origin).href;const exists=existsSync(`dist/articles/${a.id}/index.html`);assert.equal(exists,isPublished(a.data));assert.equal(sitemap('loc').toArray().some(e=>sitemap(e).text()===url),exists);assert.equal(feed('item > link').toArray().some(e=>feed(e).text()===url),exists);assert.equal(search.includes(`/articles/${a.id}/`),exists);if(exists){const row=sitemap('url').filter((_,e)=>sitemap(e).find('loc').text()===url);assert.equal(row.find('lastmod').text(),a.data.updatedAt);}}
for(const p of ['/search/','/404/'])assert(!sitemap('loc').toArray().some(e=>sitemap(e).text().endsWith(p)));
assert(readFileSync('dist/robots.txt','utf8').includes(origin+'/sitemap.xml'));
const headers=`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n/search/*\n  X-Robots-Tag: noindex, follow\n/404.html\n  X-Robots-Tag: noindex, follow\nhttps://:preview.content-payment-guide.pages.dev/*\n  X-Robots-Tag: noindex, follow\n${preview?'/*\n  X-Robots-Tag: noindex, follow\n':''}`;
writeFileSync('dist/_headers',headers);
console.log(`PASS: ${files.length} HTML pages, ${links} internal links/anchors, unique metadata, canonicals, H1, JSON-LD, ${visible.length} RSS items, sitemap lastmod, publication exclusions & preview headers.`);
