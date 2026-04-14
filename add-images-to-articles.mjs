import fs from 'fs';

const imageUrls = {
  // YouTube実践カテゴリー用イラスト
  'youtube-001': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-export-dialog-ggFa7QMAo75yiCQ7ykfiHi.webp',
  'youtube-002': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-text-editing-XnZ7m88zkEr7dUhMpsqiJH.webp',
  'youtube-003': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-audio-sync-5tWDaTjJs3qfpJTnK5qm7d.webp',
  'youtube-004': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-effects-panel-bGieCbhQpkSVLVyLSYUYqV.webp',
  'youtube-005': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-timeline-editing-KNtDR6FfjktkJvWXLcAdXE.webp',
  'youtube-006': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-pip-feature-VrDuvNtTtxtRKkd9gtsrbA.webp',
  'youtube-007': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-color-correction-eGRteaBwxKD2creBya7wZG.webp',
  'youtube-008': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-keyframe-animation-TTDXC2H6PdZArK9trQYEZd.webp',
  'youtube-009': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-audio-mixer-7JvLShZobyWx27zc48QgCh.webp',
  'youtube-010': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-storage-management-ARcgT5DER2huCLxCvBMtXW.webp',
  'youtube-011': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-export-dialog-ggFa7QMAo75yiCQ7ykfiHi.webp',
  'youtube-012': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-text-editing-XnZ7m88zkEr7dUhMpsqiJH.webp',
  'youtube-013': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-audio-sync-5tWDaTjJs3qfpJTnK5qm7d.webp',
  'youtube-014': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-effects-panel-bGieCbhQpkSVLVyLSYUYqV.webp',
  'youtube-015': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-timeline-editing-KNtDR6FfjktkJvWXLcAdXE.webp',
  'youtube-016': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-pip-feature-VrDuvNtTtxtRKkd9gtsrbA.webp',
  'youtube-017': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-color-correction-eGRteaBwxKD2creBya7wZG.webp',
  'youtube-018': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-keyframe-animation-TTDXC2H6PdZArK9trQYEZd.webp',

  // トラブル解決カテゴリー用イラスト
  'troubleshoot-001': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-export-dialog-ggFa7QMAo75yiCQ7ykfiHi.webp',
  'troubleshoot-002': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-audio-sync-5tWDaTjJs3qfpJTnK5qm7d.webp',
  'troubleshoot-003': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-timeline-editing-KNtDR6FfjktkJvWXLcAdXE.webp',
  'troubleshoot-004': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-effects-panel-bGieCbhQpkSVLVyLSYUYqV.webp',
  'troubleshoot-005': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-text-editing-XnZ7m88zkEr7dUhMpsqiJH.webp',
  'troubleshoot-006': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-timeline-editing-KNtDR6FfjktkJvWXLcAdXE.webp',
  'troubleshoot-007': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-audio-mixer-7JvLShZobyWx27zc48QgCh.webp',
  'troubleshoot-008': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-text-editing-XnZ7m88zkEr7dUhMpsqiJH.webp',
  'troubleshoot-009': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-timeline-editing-KNtDR6FfjktkJvWXLcAdXE.webp',
  'troubleshoot-010': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-pip-feature-VrDuvNtTtxtRKkd9gtsrbA.webp',
  'troubleshoot-011': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-storage-management-ARcgT5DER2huCLxCvBMtXW.webp',
  'troubleshoot-012': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-export-dialog-ggFa7QMAo75yiCQ7ykfiHi.webp',
  'troubleshoot-013': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-color-correction-eGRteaBwxKD2creBya7wZG.webp',
  'troubleshoot-014': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-audio-mixer-7JvLShZobyWx27zc48QgCh.webp',
  'troubleshoot-015': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-keyframe-animation-TTDXC2H6PdZArK9trQYEZd.webp',
  'troubleshoot-016': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-storage-management-ARcgT5DER2huCLxCvBMtXW.webp',
  'troubleshoot-017': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-text-editing-XnZ7m88zkEr7dUhMpsqiJH.webp',
  'troubleshoot-018': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663525704287/HBFu58swxnxCuDXnFPDSuU/capcut-effects-panel-bGieCbhQpkSVLVyLSYUYqV.webp',
};

const data = JSON.parse(fs.readFileSync('./shared/articles-data.json', 'utf-8'));

// YouTube実践とトラブル解決カテゴリーの記事にイラストを追加
data.articles.forEach(article => {
  if (article.categoryId === 'youtube' || article.categoryId === 'troubleshoot') {
    const imageUrl = imageUrls[article.id];
    if (imageUrl) {
      // 記事の最初に画像を挿入
      article.content = `![CapCut操作画面](${imageUrl})\n\n${article.content}`;
    }
  }
});

fs.writeFileSync('./shared/articles-data.json', JSON.stringify(data, null, 2));
console.log('記事にイラストURLを追加しました');
