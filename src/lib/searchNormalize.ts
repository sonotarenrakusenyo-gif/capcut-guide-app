const KATAKANA_START = 0x30a1;
const KATAKANA_END = 0x30f6;
const HIRAGANA_DIFF = 0x60;

function katakanaToHiragana(text: string): string {
  return text.replace(/[\u30a1-\u30f6]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - HIRAGANA_DIFF)
  );
}

export function normalizeSearchText(input: string): string {
  return katakanaToHiragana(input.normalize("NFKC").toLowerCase()).trim();
}
