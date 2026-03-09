import { Box, Chip, FormControl, InputLabel, MenuItem, Select, Typography, Paper } from '@mui/material';
import { useSearchStore } from '../../../store/searchStore';

const AVAILABLE_TAGS = ['ソファ', 'チェア', 'テーブル', 'ベッド', '収納', '照明', 'ミニバー', 'TV台', '客室', 'ロビー', '什器', 'カウンター'];
const DRAWING_TYPES = ['All', '家具図', '什器図'];

export default function FilterPanel() {
  const { selectedTags, setSelectedTags, drawingType, setDrawingType, performSearch } = useSearchStore();

  const handleTagToggle = (tag) => {
    const newTags = selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setTimeout(() => performSearch(), 0);
  };

  const handleTypeChange = (e) => {
    setDrawingType(e.target.value);
    setTimeout(() => performSearch(), 0);
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>絞り込み</Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>図面種別</Typography>
          <FormControl fullWidth size="small">
            <Select
              value={drawingType}
              onChange={handleTypeChange}
            >
              <MenuItem value="All">すべて</MenuItem>
              <MenuItem value="家具図">家具図</MenuItem>
              <MenuItem value="什器図">什器図</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: 3, minWidth: 300 }}>
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
