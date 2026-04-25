// api/sitemap.js — Dynamic Sitemap for ToolsX
// Deployed as a Vercel Serverless Function
// Reads all published posts from Firebase Firestore and generates sitemap.xml

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { cert } from 'firebase-admin/app';

// Initialize Firebase Admin (only once)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  try {
    // Fetch all published posts from Firestore
    const snapshot = await db
      .collection('posts')
      .where('status', '==', 'published')
      .orderBy('timestamp', 'desc')
      .get();

    const posts = snapshot.docs.map(doc => ({
      id:   doc.id,
      date: doc.data().date || new Date().toISOString().split('T')[0],
    }));

    // Static pages
    const staticPages = [
      { loc: 'https://toolsx.online/',             priority: '1.0', changefreq: 'daily'  },
      { loc: 'https://toolsx.online/?cat=review',  priority: '0.7', changefreq: 'weekly' },
      { loc: 'https://toolsx.online/?cat=guide',   priority: '0.7', changefreq: 'weekly' },
      { loc: 'https://toolsx.online/?cat=news',    priority: '0.7', changefreq: 'daily'  },
      { loc: 'https://toolsx.online/?cat=tutorial',priority: '0.7', changefreq: 'weekly' },
      { loc: 'https://toolsx.online/?cat=tools',   priority: '0.7', changefreq: 'weekly' },
      { loc: 'https://toolsx.online/?cat=compare', priority: '0.7', changefreq: 'weekly' },
    ];

    // Build XML
    const staticXml = staticPages.map(p => `
  <url>
    <loc>${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('');

    const postXml = posts.map(p => `
  <url>
    <loc>https://toolsx.online/post/${p.id}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${postXml}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache 1 hour on Vercel CDN
    res.status(200).send(xml);

  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Error generating sitemap');
  }
}
