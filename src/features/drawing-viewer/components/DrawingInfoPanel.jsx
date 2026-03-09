import { Box, Typography, Chip, Divider, Paper } from '@mui/material';
import { useDrawingStore } from '../../../store/drawingStore';

export default function DrawingInfoPanel() {
  const { selectedDrawing } = useDrawingStore();

  if (!selectedDrawing) return null;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {selectedDrawing.title}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">案件名</Typography>
        <Typography variant="body1">{selectedDrawing.projectName}</Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>タグ</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedDrawing.tags.map(tag => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">説明</Typography>
        <Typography variant="body2">{selectedDrawing.description}</Typography>
      </Box>
      
      <Box>
        <Typography variant="subtitle2" color="text.secondary">備考</Typography>
        <Typography variant="body2">{selectedDrawing.note || 'なし'}</Typography>
      </Box>
    </Paper>
  );
}
