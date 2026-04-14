import { getDb } from './server/db.ts';
import { articles } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const imageMap = {
  'troubleshoot-batch-edit': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-batch-edit-29aJXHcHH7VpudAYEmSn8T.webp',
  'troubleshoot-insert-video': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-video-insert-hiS5WtVDm5uYbRtRTzqv2i.webp',
  'troubleshoot-pip': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-pip-TYwVAppfcQZQBTtmTTrJSg.webp',
  'youtube-jumpcut': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-jumpcut-nwJu8HXAGHNe5s5tQRsXvN.webp',
  'youtube-caption-design': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-auto-caption-9VtfBJUf9dm4mfXvDPCK4F.webp',
  'youtube-retention': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-text-se-QFtARD9uqrwH823Vnsji87.webp'
};

async function updateArticlesWithImages() {
  const db = await getDb();
  if (!db) {
    console.error('Database connection failed');
    process.exit(1);
  }

  console.log('🖼️  Updating articles with real images...');
  
  for (const [articleId, imageUrl] of Object.entries(imageMap)) {
    const result = await db.select().from(articles).where(eq(articles.id, articleId)).limit(1);
    
    if (result.length === 0) {
      console.log(`⚠️  Article not found: ${articleId}`);
      continue;
    }

    const currentContent = result[0].content;
    const imageMarkdown = `\n\n![操作画面](${imageUrl})\n\n`;
    
    // Insert image after the first heading
    const updatedContent = currentContent.replace(/^(#[^#].*\n)/, `$1${imageMarkdown}`);
    
    await db.update(articles).set({ content: updatedContent }).where(eq(articles.id, articleId));
    console.log(`✅ Updated: ${articleId}`);
  }

  console.log('✅ All articles updated with images');
}

updateArticlesWithImages().catch(console.error);
