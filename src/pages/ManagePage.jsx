import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, Chip, Autocomplete, InputAdornment, TableSortLabel, Checkbox, Tooltip } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon, ContentCopy as CopyIcon, Visibility as ViewIcon, AutoFixHigh as AutoFixHighIcon, SelectAll as SelectAllIcon, Deselect as DeselectIcon } from '@mui/icons-material';
import { useState, useMemo } from 'react';
import { useSearchStore } from '../store/searchStore';

const MARKETS = ['オフィス', 'ホテル', 'レストラン', '医療・福祉', '公共・商業'];
const YEARS = Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => `${new Date().getFullYear() - i}年`);

export default function ManagePage() {
  const { allDocs, removePdf, updatePdf } = useSearchStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // ソート状態
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('uploadedAt'); // デフォルトはアップロード日時の降順

  // 選択状態
  const [selected, setSelected] = useState([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  
  // 編集用ダイアログの状態
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState(null);
  const [editForm, setEditForm] = useState({ projectName: '', market: '', createdYear: '' });

  // 削除確認用ダイアログの状態
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPdf, setDeletingPdf] = useState(null);

  // 閲覧ダイアログの状態
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingPdf, setViewingPdf] = useState(null);

  // 既存の案件名リストを生成（一括編集用などのサジェスト）
  const projectNames = [...new Set(allDocs.map(doc => doc.projectName).filter(Boolean))];

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedAndFilteredDocs = useMemo(() => {
    let result = allDocs;
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.title.toLowerCase().includes(lowerQ) ||
        d.projectName.toLowerCase().includes(lowerQ) ||
        (d.market && d.market.toLowerCase().includes(lowerQ)) ||
        (d.decade && d.decade.toLowerCase().includes(lowerQ))
      );
    }
    
    return [...result].sort((a, b) => {
      let aVal = a[orderBy] || '';
      let bVal = b[orderBy] || '';
      
      if (orderBy === 'groups') {
        aVal = a.groups?.length || 0;
        bVal = b.groups?.length || 0;
      }
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allDocs, searchQuery, order, orderBy]);

  const handleEditClick = (pdf) => {
    setEditingPdf(pdf);
    setEditForm({
      projectName: pdf.projectName || '',
      market: pdf.market || 'オフィス',
      createdYear: pdf.decade || `${new Date().getFullYear()}年`,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingPdf) {
      updatePdf(editingPdf.id, {
        projectName: editForm.projectName,
        market: editForm.market,
        decade: editForm.createdYear
      });
    }
    setEditDialogOpen(false);
  };

  const handleDeleteClick = (pdf) => {
    setDeletingPdf(pdf);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingPdf) {
      removePdf(deletingPdf.id);
    }
    setDeleteDialogOpen(false);
  };

  const handleViewClick = (pdf) => {
    setViewingPdf(pdf);
    setViewDialogOpen(true);
  };

  const handleSelectAll = () => {
    setSelected(sortedAndFilteredDocs.map(d => d.id));
  };
  
  const handleClearSelection = () => {
    setSelected([]);
    setLastSelectedIndex(null);
  };

  const handleAutoAssignMarket = () => {
    let updateCount = 0;
    selected.forEach(pdfId => {
      const doc = allDocs.find(d => d.id === pdfId);
      if (doc) {
        const textToAnalyze = (doc.projectName + " " + doc.title).toLowerCase();
        let guessedMarket = doc.market;
        
        if (/ホテル|客室|旅館|宿/.test(textToAnalyze)) guessedMarket = 'ホテル';
        else if (/オフィス|事務|会議|本社|支社/.test(textToAnalyze)) guessedMarket = 'オフィス';
        else if (/レストラン|飲食|カフェ|食堂|厨房/.test(textToAnalyze)) guessedMarket = 'レストラン';
        else if (/病院|クリニック|福祉|医療|介護|保健/.test(textToAnalyze)) guessedMarket = '医療・福祉';
        else if (/店舗|商業|公共|学校|役所|公民館|図書館/.test(textToAnalyze)) guessedMarket = '公共・商業';
        
        if (guessedMarket && guessedMarket !== doc.market) {
          updatePdf(pdfId, { market: guessedMarket });
          updateCount++;
        }
      }
    });

    alert(`${selected.length}件中、${updateCount}件の５大市場をファイル名・案件名から自動判定し更新しました。`);
    setSelected([]);
  };

  const handleRowClick = (event, index, doc) => {
    if (event.shiftKey && lastSelectedIndex !== null) {
      // Shift + クリック: 範囲選択
      const start = Math.min(index, lastSelectedIndex);
      const end = Math.max(index, lastSelectedIndex);
      const rangeIds = sortedAndFilteredDocs.slice(start, end + 1).map(d => d.id);
      
      if (event.ctrlKey || event.metaKey) {
        setSelected(prev => [...new Set([...prev, ...rangeIds])]);
      } else {
        setSelected(rangeIds);
      }
    } else if (event.ctrlKey || event.metaKey) {
      // Ctrl + クリック: 個別追加・解除
      const selectedIndex = selected.indexOf(doc.id);
      let newSelected = [];
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, doc.id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
      setSelected(newSelected);
      setLastSelectedIndex(index);
    } else {
      // 通常クリック: 単一選択
      setSelected([doc.id]);
      setLastSelectedIndex(index);
    }
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>登録図面一覧</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {selected.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2, alignItems: 'center', bgcolor: 'primary.50', px: 2, py: 0.5, borderRadius: 2 }}>
              <Typography variant="body2" fontWeight="bold" color="primary.main">{selected.length}件選択中</Typography>
              <Tooltip title="ファイル名・案件名から市場を自動判定・更新します">
                <Button size="small" variant="contained" color="secondary" startIcon={<AutoFixHighIcon />} onClick={handleAutoAssignMarket}>
                  5大市場を自動設定
                </Button>
              </Tooltip>
            </Box>
          )}
          <Tooltip title="すべて選択">
            <IconButton onClick={handleSelectAll} color="primary" disabled={sortedAndFilteredDocs.length === 0}><SelectAllIcon /></IconButton>
          </Tooltip>
          <Tooltip title="選択解除">
            <IconButton onClick={handleClearSelection} color="default" disabled={selected.length === 0}><DeselectIcon /></IconButton>
          </Tooltip>
          <TextField
            size="small"
            placeholder="図面ファイル名や案件名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 300, bgcolor: 'background.paper' }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
            }}
          />
        </Box>
      </Box>

      {allDocs.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', bgcolor: 'transparent', borderStyle: 'dashed' }}>
          <Typography color="text.secondary">まだ登録された図面がありません。サイドバーの「新規登録」からアップロードしてください。</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="drawings table">
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < sortedAndFilteredDocs.length}
                    checked={sortedAndFilteredDocs.length > 0 && selected.length === sortedAndFilteredDocs.length}
                    onChange={(e) => e.target.checked ? handleSelectAll() : handleClearSelection()}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? order : 'asc'}
                    onClick={() => handleRequestSort('title')}
                  >
                    ファイル名
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={orderBy === 'projectName'}
                    direction={orderBy === 'projectName' ? order : 'asc'}
                    onClick={() => handleRequestSort('projectName')}
                  >
                    案件名
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={orderBy === 'market'}
                    direction={orderBy === 'market' ? order : 'asc'}
                    onClick={() => handleRequestSort('market')}
                  >
                    5大市場
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={orderBy === 'decade'}
                    direction={orderBy === 'decade' ? order : 'asc'}
                    onClick={() => handleRequestSort('decade')}
                  >
                    作成年
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={orderBy === 'uploadedAt'}
                    direction={orderBy === 'uploadedAt' ? order : 'asc'}
                    onClick={() => handleRequestSort('uploadedAt')}
                  >
                    アップロード日時
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={orderBy === 'uploaderName'}
                    direction={orderBy === 'uploaderName' ? order : 'asc'}
                    onClick={() => handleRequestSort('uploaderName')}
                  >
                    登録者
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  <TableSortLabel
                    active={orderBy === 'groups'}
                    direction={orderBy === 'groups' ? order : 'asc'}
                    onClick={() => handleRequestSort('groups')}
                  >
                    図面数 (ページ)
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAndFilteredDocs.length > 0 ? sortedAndFilteredDocs.map((doc, index) => {
                const isItemSelected = isSelected(doc.id);
                return (
                  <TableRow 
                    key={doc.id} 
                    hover
                    onClick={(event) => handleRowClick(event, index, doc)}
                    onDoubleClick={(e) => { e.stopPropagation(); handleViewClick(doc); }}
                    selected={isItemSelected}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      bgcolor: isItemSelected ? 'action.selected' : 'inherit',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1,
                        position: 'relative',
                        bgcolor: isItemSelected ? 'action.selected' : 'action.hover'
                      }
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                    {doc.title}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">{doc.projectName}</Typography>
                  </TableCell>
                  <TableCell>
                    {doc.market ? <Chip label={doc.market} size="small" sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText', fontWeight: 'bold' }} /> : '-'}
                  </TableCell>
                  <TableCell>
                    {doc.decade ? <Chip label={doc.decade} size="small" sx={{ bgcolor: 'info.light', color: 'info.contrastText', fontWeight: 'bold' }} /> : '-'}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit' }) : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {doc.uploaderName ? <Chip label={doc.uploaderName} size="small" variant="outlined" /> : <Typography variant="caption" color="text.secondary">-</Typography>}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Chip label={`${doc.groups?.length || 0} 件`} variant="outlined" size="small" />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <IconButton size="small" color="info" onClick={(e) => { e.stopPropagation(); handleViewClick(doc); }} sx={{ mr: 1 }} title="PDFを閲覧">
                      <ViewIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={(e) => { e.stopPropagation(); handleEditClick(doc); }} sx={{ mr: 1 }} title="情報を編集">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteClick(doc); }} title="図面を削除">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                    検索条件に一致する図面が見つかりません。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 編集ダイアログ */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: 1, borderColor: 'divider', pb: 2 }}>
          図面情報の編集
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: -1 }}>対象ファイル: {editingPdf?.title}</Typography>
            
            <Autocomplete
              freeSolo
              options={projectNames}
              value={editForm.projectName}
              onChange={(e, newValue) => setEditForm({ ...editForm, projectName: newValue || '' })}
              onInputChange={(e, newInputValue) => setEditForm({ ...editForm, projectName: newInputValue })}
              renderInput={(params) => (
                <TextField 
                  {...params}
                  label="案件名" 
                  variant="outlined" 
                  fullWidth 
                  size="small"
                />
              )}
            />
            
            <Box sx={{ display: 'flex', gap: 3 }}>
              <FormControl sx={{ flex: 1 }} size="small">
                <InputLabel>5大市場</InputLabel>
                <Select
                  value={editForm.market}
                  label="5大市場"
                  onChange={(e) => setEditForm({ ...editForm, market: e.target.value })}
                >
                  {MARKETS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1 }} size="small">
                <InputLabel>作成年</InputLabel>
                <Select
                  value={editForm.createdYear}
                  label="作成年"
                  onChange={(e) => setEditForm({ ...editForm, createdYear: e.target.value })}
                >
                  {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">キャンセル</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">保存</Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>図面の削除確認</DialogTitle>
        <DialogContent>
          <Typography>本当に「{deletingPdf?.title}」を削除しますか？</Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            この操作は取り消せません。また、このファイルに含まれる {deletingPdf?.groups?.length || 0} 件の図面セットもすべて削除されます。
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">キャンセル</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">削除する</Button>
        </DialogActions>
      </Dialog>

      {/* 閲覧ダイアログ */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { height: '90vh' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          図面閲覧: {viewingPdf?.title}
          <Button onClick={() => setViewDialogOpen(false)} color="inherit" size="small">閉じる</Button>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          {viewingPdf?.pdfUrl && (
            <iframe 
              src={viewingPdf.pdfUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 'none' }} 
              title="PDF Preview"
            />
          )}
        </DialogContent>
      </Dialog>

    </Box>
  );
}
