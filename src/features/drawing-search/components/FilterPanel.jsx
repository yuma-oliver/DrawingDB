import { Box, Chip, FormControl, InputLabel, MenuItem, Select, Typography, Paper } from '@mui/material';
import { useSearchStore } from '../../../store/searchStore';

const AVAILABLE_TAGS = ['建築', '設備', '平面図', '詳細図', '1階', '配管', 'B棟', '内装', '外構', '植栽', '照明', 'エントランス'];
const DRAWING_TYPES = ['All', 'Plan', 'Equipment', 'Detail', 'Exterior'];

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
              <MenuItem value="Plan">平面図</MenuItem>
              <MenuItem value="Equipment">設備図</MenuItem>
              <MenuItem value="Detail">詳細図</MenuItem>
              <MenuItem value="Exterior">外構図</MenuItem>
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
