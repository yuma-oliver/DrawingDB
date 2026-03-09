import { Box, Typography, Paper, Card, CardMedia, CardContent, CardActionArea } from '@mui/material';
import { useSearchStore } from '../../../store/searchStore';
import { useNavigate } from 'react-router-dom';

export default function SimilarDrawingsPanel() {
  const { results } = useSearchStore();
  const navigate = useNavigate();

  // モックとして検索結果からランダムに2件取得
  const similarDrawings = results.slice(0, 2);

  if (similarDrawings.length === 0) return null;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        類似図面（AI推薦）
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
        ※将来的にAIが形状や属性から類似図面を提案します
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {similarDrawings.map((drawing) => (
          <Card key={drawing.id} variant="outlined" sx={{ display: 'flex', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }}}>
            <CardActionArea onClick={() => navigate(`/drawings/${drawing.id}`)} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <CardMedia
                component="img"
                sx={{ width: 80, height: 80, objectFit: 'cover' }}
                image={drawing.thumbnail}
                alt={drawing.title}
              />
              <CardContent sx={{ flex: '1 0 auto', py: 1, px: 2 }}>
                <Typography variant="subtitle2" component="div" noWrap sx={{ maxWidth: 200 }}>
                  {drawing.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  一致度: {Math.floor(Math.random() * 20 + 80)}%
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Paper>
  );
}
