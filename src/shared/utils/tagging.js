import { FURNITURE_TAGS, DRAWING_TYPE_TAGS, SPACE_TAGS, ATTRIBUTE_TAGS } from '../constants/tagDictionary';
import { EXCLUDE_WORDS } from '../constants/excludeWords';

export const analyzeTagsAndTitle = (pagesData) => {
  // [{ pageNum: 1, text: "raw string", items: [...] }]
  let combinedText = '';
  let allItems = [];
  
  pagesData.forEach(p => {
    combinedText += p.text + ' ';
    if (p.items) {
      allItems = allItems.concat(p.items.map(i => ({ ...i, pageNum: p.pageNum })));
    }
  });

  const normalizedText = combinedText.toLowerCase();

  // 1. タイトル抽出
  let extractedTitle = null;
  let titleEvidence = null;

  // ① Item欄優先
  const titleKeywords = ['item name:', 'item:', 'title:', '名称：', '品名：', 'item name', 'item', 'title', '名称', '品名'];
  for (const keyword of titleKeywords) {
    const idx = normalizedText.indexOf(keyword.toLowerCase());
    if (idx !== -1) {
      // 直後の文字列を抽出
      const startIndex = idx + keyword.length;
      const substring = combinedText.substring(startIndex, startIndex + 100).trim();
      const match = substring.match(/^([^\n]+)/); // 行末まで取る
      if (match && match[1].trim().length > 1) {
        let textCandidate = match[1].trim();
        // 見つかったテキストが除外語だけで構成されていないかだけチェック
        if (!EXCLUDE_WORDS.some(w => textCandidate === w)) {
           extractedTitle = textCandidate;
           titleEvidence = `${keyword} ${extractedTitle}`;
           break;
        }
      }
    }
  }

  // ② フォントサイズ優先 / ③ ページ上部優先
  if (!extractedTitle && allItems.length > 0) {
    // 高さとy座標でソート (高さ降順、y座標昇順)
    const sortedItems = [...allItems].sort((a, b) => {
      if (b.height !== a.height) return b.height - a.height;
      return a.y - b.y;
    });
    
    // トップの候補を探す
    for(let i=0; i<sortedItems.length; i++){
       const item = sortedItems[i];
       const str = item.str.trim();
       if(str.length >= 2 && !EXCLUDE_WORDS.some(w => str.includes(w))) {
          extractedTitle = str;
          titleEvidence = `フォント解析: ${extractedTitle} (H:${Math.round(item.height)})`;
          break;
       }
    }
  }

  if (!extractedTitle) {
    extractedTitle = `図面 P.${pagesData.length > 0 ? pagesData[0].pageNum : '不明'}`;
    titleEvidence = "Fallback";
  }

  // 2. タグスコアリング
  const scores = {};
  const evidenceList = [];

  const addScore = (tag, points, word, pageNum, reason) => {
    scores[tag] = (scores[tag] || 0) + points;
    // 重複を避けてevidenceに追加
    if (!evidenceList.some(e => e.word === word && e.page === pageNum)) {
      evidenceList.push({ word, page: pageNum, reason });
    }
  };

  const calculateMatches = (dictionary, category) => {
    for (const [key, patterns] of Object.entries(dictionary)) {
      for (const pattern of patterns) {
        // パターンがテキスト内に存在するか確認
        pagesData.forEach(page => {
          const pageLower = page.text.toLowerCase();
          const patternLower = pattern.toLowerCase();
          
          let idx = pageLower.indexOf(patternLower);
          let count = 0;
          
          while (idx !== -1) {
            count++;
            let points = 3; // 通常
            
            // 例: タイトル証拠に含まれているか
            if (titleEvidence && titleEvidence.toLowerCase().includes(patternLower)) {
              points = 10;
            } else if (extractedTitle.toLowerCase().includes(patternLower)) {
              points = 8;
            }
            
            // 同一語の複数回出現による2回目以降の加点 (+2/回) - initial is base + points
            if (count > 1) {
              points = 2;
            }

            // 除外語の近辺チェック
            const surroundingText = pageLower.substring(Math.max(0, idx - 15), Math.min(pageLower.length, idx + patternLower.length + 15));
            if (EXCLUDE_WORDS.some(w => surroundingText.includes(w.toLowerCase()))) {
              points -= 2;
            }

            addScore(key, points, pattern, page.pageNum, category);
            idx = pageLower.indexOf(patternLower, idx + patternLower.length);
          }
        });
      }
    }
  };

  calculateMatches(FURNITURE_TAGS, 'furniture');
  calculateMatches(DRAWING_TYPE_TAGS, 'drawingType');
  calculateMatches(SPACE_TAGS, 'space');
  calculateMatches(ATTRIBUTE_TAGS, 'attribute');

  // 主タグの決定 (Furnitureの中で最大スコア)
  let mainTag = '未分類';
  let maxScore = 0;
  let totalScore = 0;
  
  for (const [key, score] of Object.entries(scores)) {
    totalScore += Math.max(0, score); // 負のスコアは無視
    if (Object.keys(FURNITURE_TAGS).includes(key) && score > maxScore) {
      maxScore = score;
      mainTag = key;
    }
  }

  const confidence = totalScore > 0 ? Math.min(1.0, parseFloat((maxScore / (totalScore * 0.5)).toFixed(2))) : 0.0;

  // 補助タグ
  const subTags = [];
  const spaceTags = [];
  const attributeTags = [];
  let drawingType = '詳細図';
  let drawingTypeScore = 0;

  for (const [key, score] of Object.entries(scores)) {
    if (score > 0) {
      if (Object.keys(DRAWING_TYPE_TAGS).includes(key) && score > drawingTypeScore) {
        drawingTypeScore = score;
        drawingType = key;
      }
      if (Object.keys(SPACE_TAGS).includes(key)) {
        spaceTags.push(key);
        subTags.push(key);
      }
      if (Object.keys(ATTRIBUTE_TAGS).includes(key)) {
        attributeTags.push(key);
        subTags.push(key);
      }
      if (Object.keys(FURNITURE_TAGS).includes(key) && key !== mainTag) {
        subTags.push(key);
      }
    }
  }
  
  // 図面種別も補助タグに
  if (drawingTypeScore > 0 && !subTags.includes(drawingType)) {
    subTags.push(drawingType);
  }

  return {
    title: extractedTitle,
    titleEvidence,
    mainTag,
    subTags: [...new Set(subTags)].slice(0, 5),
    drawingType,
    spaceTags,
    attributeTags,
    confidence,
    evidence: evidenceList,
    tags: [mainTag, ...new Set(subTags)] // 互換性のため
  };
};
