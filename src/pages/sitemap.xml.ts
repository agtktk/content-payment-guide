import type {APIRoute} from 'astro';
import {publishedArticles,articleUrl,latestDate} from '../lib/content';
import {site,topics} from '../data/site';
export const GET:APIRoute=async({site:origin})=>{
 const articles=await publishedArticles();
 const entries=[...['/','/topics/','/articles/','/information-fee/'].map(path=>({path,date:latestDate(articles,site.updatedAt)})),...['/guide/','/about/','/contact/','/privacy/'].map(path=>({path,date:site.updatedAt})),...topics.map(t=>({path:`/topics/${t.id}/`,date:latestDate(articles.filter(a=>a.data.topic===t.id),site.updatedAt)})),...articles.map(a=>({path:articleUrl(a.id),date:a.data.updatedAt}))];
 const xml=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(e=>`<url><loc>${new URL(e.path,origin).href}</loc><lastmod>${e.date}</lastmod></url>`).join('')}</urlset>`;
 return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
