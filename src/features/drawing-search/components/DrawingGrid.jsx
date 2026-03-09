import { Grid, Typography, Box } from '@mui/material';
import DrawingCard from './DrawingCard';
import { useSearchStore } from '../../../store/searchStore';

export default function DrawingGrid() {
  const { results } = useSearchStore();

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

  return (
    <Grid container spacing={3}>
      {results.map((drawing) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={drawing.id}>
          <DrawingCard drawing={drawing} />
        </Grid>
      ))}
    </Grid>
  );
}
