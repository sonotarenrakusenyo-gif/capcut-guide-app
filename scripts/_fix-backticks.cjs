const fs = require('fs');
const file = 'scripts/update-batch4-youtube-011-018.mjs';
let txt = fs.readFileSync(file, 'utf8');

// テンプレートリテラルの記事テキスト内にある inline code (backtick) を **bold** に変換
// パターン: `word` → **word**  (テンプレートリテラル境界のバッククォートは除く)
// シンプルなアプローチ: 1〜60文字の inline code を太字に置換

const bt = '`';
// `something` を **something** に（テンプレートリテラル内の inline code）
const result = txt.replace(new RegExp(bt + '([^\\n' + bt + ']{1,80})' + bt, 'g'), (m, inner) => {
  // テンプレートリテラルの開始・終了（`,  など）は通常1文字なので除外
  if (inner.trim() === '' || inner.includes('\n')) return m;
  return '**' + inner + '**';
});

fs.writeFileSync(file, result);
console.log('backtick fix done');
