import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { Description as FileIcon, Pages as PagesIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function DrawingCard({ drawing }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/drawings/${drawing.id}`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
      <CardActionArea onClick={handleClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <CardMedia
          component="img"
          height="160"
          image={drawing.thumbnail}
          alt={drawing.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.1rem', lineHeight: 1.2 }}>
              {drawing.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
              <PagesIcon fontSize="small" />
              <Typography variant="caption">{drawing.pageCount}p</Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
            <FileIcon fontSize="small" /> {drawing.projectName}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {drawing.description}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 'auto' }}>
            {drawing.tags.slice(0, 3).map(tag => (
              <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
            ))}
            {drawing.tags.length > 3 && (
              <Chip label={`+${drawing.tags.length - 3}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
