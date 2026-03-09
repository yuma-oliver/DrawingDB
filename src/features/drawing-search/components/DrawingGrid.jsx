import { Grid, Typography, Box, ToggleButtonGroup, ToggleButton, FormControl, Select, MenuItem, Stack } from '@mui/material';
import { ViewList as ViewListIcon, GridView as GridViewIcon } from '@mui/icons-material';
import DrawingCard from './DrawingCard';
import { useSearchStore } from '../../../store/searchStore';

export default function DrawingGrid() {
  const { results, viewMode, setViewMode, gridSize, setGridSize } = useSearchStore();

  if (results.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          該当する図面が見つかりませんでした。
        </Typography>
        <Typography variant="body2" color="text.secondary">
          検索条件を変えてお試しください。
        </Typography>
      </Box>
    );
  }

  const getGridProps = () => {
    if (viewMode === 'list') return { xs: 12 };
    switch (gridSize) {
      case 'small': return { xs: 6, sm: 4, md: 3, lg: 2 };
      case 'large': return { xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }; // enlarged
      case 'medium':
      default: return { xs: 12, sm: 6, md: 4, lg: 3 };
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          検索結果: {results.length} 件
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {viewMode === 'grid' && (
            <FormControl size="small" variant="outlined">
              <Select
                value={gridSize}
                onChange={(e) => setGridSize(e.target.value)}
                sx={{ height: 36, bgcolor: 'background.paper' }}
              >
                <MenuItem value="small">小</MenuItem>
                <MenuItem value="medium">中</MenuItem>
                <MenuItem value="large">大</MenuItem>
              </Select>
            </FormControl>
          )}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
            sx={{ bgcolor: 'background.paper' }}
          >
            <ToggleButton value="grid" aria-label="grid view">
              <GridViewIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {results.map((drawing) => (
          <Grid size={getGridProps()} key={drawing.id}>
            <DrawingCard drawing={drawing} viewMode={viewMode} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
