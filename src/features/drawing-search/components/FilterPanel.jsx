import { Box, Chip, FormControl, MenuItem, Select, Typography, Paper, Autocomplete, TextField } from '@mui/material';
import { useSearchStore } from '../../../store/searchStore';

const AVAILABLE_TAGS = ['ソファ', 'チェア', 'テーブル', 'ベッド', '収納', '照明', 'ミニバー', 'TV台', '客室', 'ロビー', '什器', 'カウンター'];
const MARKETS = ['オフィス', 'ホテル', 'レストラン', '医療・福祉', '公共・商業'];
const DECADES = Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => `${new Date().getFullYear() - i}年`);

export default function FilterPanel() {
  const { 
    selectedTags, setSelectedTags, 
    drawingType, setDrawingType, 
    selectedMarket, setSelectedMarket,
    selectedDecade, setSelectedDecade,
    selectedProjectName, setSelectedProjectName,
    allDocs,
    performSearch 
  } = useSearchStore();

  const handleTagToggle = (tag) => {
    const newTags = selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setTimeout(() => performSearch(), 0);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setTimeout(() => performSearch(), 0);
  };

  const projectNames = [...new Set(allDocs.map(doc => doc.projectName).filter(Boolean))];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>絞り込み</Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        
        {/* メインフィルター行 */}
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
          
          <Box sx={{ flex: 1, minWidth: 150 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>5大市場</Typography>
            <FormControl fullWidth size="small">
              <Select value={selectedMarket} onChange={handleFilterChange(setSelectedMarket)}>
                <MenuItem value="All">すべて</MenuItem>
                {MARKETS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1, minWidth: 150 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>案件名</Typography>
            <Autocomplete
              size="small"
              options={['All', ...projectNames]}
              value={selectedProjectName}
              onChange={(e, newValue) => {
                const newProjectVal = newValue || 'All';
                setSelectedProjectName(newProjectVal);
                
                if (newProjectVal !== 'All') {
                  const targetDoc = allDocs.find(d => d.projectName === newProjectVal);
                  if (targetDoc && targetDoc.market) {
                    setSelectedMarket(targetDoc.market);
                  }
                }
                
                setTimeout(() => performSearch(), 0);
              }}
              renderInput={(params) => <TextField {...params} variant="outlined" />}
              disableClearable={false}
              freeSolo={false}
              getOptionLabel={(option) => option === 'All' ? 'すべて' : option}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 150 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>作成年代</Typography>
            <FormControl fullWidth size="small">
              <Select value={selectedDecade} onChange={handleFilterChange(setSelectedDecade)}>
                <MenuItem value="All">すべて</MenuItem>
                {DECADES.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ flex: 1, minWidth: 150 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>図面種別</Typography>
            <FormControl fullWidth size="small">
              <Select value={drawingType} onChange={handleFilterChange(setDrawingType)}>
                <MenuItem value="All">すべて</MenuItem>
                <MenuItem value="家具図">家具図</MenuItem>
                <MenuItem value="什器図">什器図</MenuItem>
              </Select>
            </FormControl>
          </Box>

        </Box>

        {/* サブフィルター行（タグ） */}
        <Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>タグ</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {AVAILABLE_TAGS.map(tag => (
              <Chip 
                key={tag} 
                label={tag} 
                size="small"
                onClick={() => handleTagToggle(tag)}
                color={selectedTags.includes(tag) ? "primary" : "default"}
                variant={selectedTags.includes(tag) ? "filled" : "outlined"}
              />
            ))}
          </Box>
        </Box>

      </Box>
    </Paper>
  );
}
