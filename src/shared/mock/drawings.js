export const mockDrawings = [
  {
    id: '1',
    title: 'A棟1階 平面図',
    projectName: '〇〇オフィスビル新築工事',
    tags: ['平面図', '1階', '建築'],
    description: 'A棟1階の基本平面図です。変更履歴あり。',
    pageCount: 5,
    thumbnail: 'https://placehold.co/600x400/E8F5E9/2E7D32?text=Drawing+1',
    drawingType: 'Plan',
    note: '最新版。設備図との整合性確認済み。',
    pages: [
      { id: '1-1', pageNum: 1, type: '表紙' },
      { id: '1-2', pageNum: 2, type: '平面図詳細A' },
      { id: '1-3', pageNum: 3, type: '平面図詳細B' },
      { id: '1-4', pageNum: 4, type: '展開図' },
      { id: '1-5', pageNum: 5, type: '注記一覧' }
    ]
  },
  {
    id: '2',
    title: 'B棟 設備配管図',
    projectName: '〇〇オフィスビル新築工事',
    tags: ['設備', '配管', 'B棟'],
    description: 'B棟の空調・給排水配管図面。',
    pageCount: 3,
    thumbnail: 'https://placehold.co/600x400/E3F2FD/1565C0?text=Drawing+2',
    drawingType: 'Equipment',
    note: '一部変更の可能性あり',
    pages: [
      { id: '2-1', pageNum: 1, type: '全体配管図' },
      { id: '2-2', pageNum: 2, type: '空調ダクト詳細' },
      { id: '2-3', pageNum: 3, type: '給排水詳細' }
    ]
  },
  {
    id: '3',
    title: 'エントランス詳細図',
    projectName: '△△商業施設改修工事',
    tags: ['詳細図', 'エントランス', '内装'],
    description: '1階メインエントランスの造作詳細図。',
    pageCount: 1,
    thumbnail: 'https://placehold.co/600x400/FFF3E0/E65100?text=Drawing+3',
    drawingType: 'Detail',
    note: '素材指定は別途仕様書参照',
    pages: [
      { id: '3-1', pageNum: 1, type: '詳細図' }
    ]
  },
  {
    id: '4',
    title: '外構計画図',
    projectName: '△△商業施設改修工事',
    tags: ['外構', '植栽', '照明'],
    description: '敷地外周りおよび駐車場周辺の計画図。',
    pageCount: 2,
    thumbnail: 'https://placehold.co/600x400/F3E5F5/6A1B9A?text=Drawing+4',
    drawingType: 'Exterior',
    note: '市への申請用データ含む',
    pages: [
      { id: '4-1', pageNum: 1, type: '全体計画図' },
      { id: '4-2', pageNum: 2, type: '植栽詳細' }
    ]
  }
];
