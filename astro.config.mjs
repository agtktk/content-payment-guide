import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
const site = process.env.SITE_URL || 'https://content-payment-guide.pages.dev';
export default defineConfig({ site, output: 'static', trailingSlash: 'always', integrations: [mdx()], devToolbar: {enabled:false} });
