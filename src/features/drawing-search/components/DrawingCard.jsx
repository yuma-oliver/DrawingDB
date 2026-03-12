import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { Description as FileIcon, Pages as PagesIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function DrawingCard({ drawing, viewMode = 'grid' }) {
  const navigate = useNavigate();
  const isList = viewMode === 'list';

  const handleClick = () => {
    navigate(`/drawings/${drawing.id}`);
  };

  return (
    <Card sx={{ 
      height: isList ? 'auto' : '100%', 
      aspectRatio: isList ? 'auto' : '1 / 1',
      display: 'flex', 
      flexDirection: isList ? 'row' : 'column', 
      transition: '0.3s', 
      '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } 
    }}>
      <CardActionArea onClick={handleClick} sx={{ display: 'flex', flexDirection: isList ? 'row' : 'column', alignItems: 'stretch', justifyContent: 'flex-start', flexGrow: 1, height: '100%' }}>
        <Box sx={{ 
          position: 'relative', 
          height: isList ? '100%' : '50%', 
          width: isList ? 160 : '100%', 
          minHeight: isList ? 140 : 'auto',
          flexShrink: 0, 
          borderRight: isList ? 1 : 0, 
          borderColor: 'divider',
          bgcolor: '#e0e0e0', // Placeholder gray
          overflow: 'hidden'
        }}>
          {drawing.thumbnail ? (
            <CardMedia
              component="img"
              sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
              image={drawing.thumbnail}
              alt={drawing.title}
            />
          ) : (
            <Box sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled' }}>
              <PagesIcon sx={{ fontSize: 40, opacity: 0.5 }} />
            </Box>
          )}
          <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0.5 }}>
            <Chip 
              label={drawing.mainTag || '未分類'} 
              size="small" 
              color="primary" 
              sx={{ fontWeight: 'bold', fontSize: '0.7rem', height: 22, boxShadow: 1 }} 
            />
            {drawing.confidence > 0 && (
              <Chip 
                label={`${(drawing.confidence * 100).toFixed(0)}%`} 
                size="small" 
                sx={{ bgcolor: 'rgba(255,255,255,0.9)', fontWeight: 'bold', fontSize: '0.65rem', height: 22, color: 'text.secondary', boxShadow: 1 }} 
              />
            )}
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', p: 1.5, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
            <Typography gutterBottom variant="subtitle1" component="div" title={drawing.title} sx={{ fontWeight: 'bold', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: isList ? 1 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.9rem', m: 0 }}>
              {drawing.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5, flexShrink: 0, ml: 1 }}>
              <PagesIcon fontSize="small" />
              <Typography variant="caption" fontWeight="bold">
                {drawing.startPage === drawing.endPage 
                  ? `P.${drawing.startPage}` 
                  : `P.${drawing.startPage}-${drawing.endPage}`}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 2, mb: 1, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <FileIcon sx={{ fontSize: 14 }} /> {drawing.projectName}
            </Typography>
            {isList && (
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                {drawing.pdfTitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 1, mt: -0.5 }}>
            {drawing.market && (
               <Typography variant="caption" sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText', px: 0.8, py: 0.2, borderRadius: 1, fontSize: '0.65rem', fontWeight: 'bold' }}>
                 {drawing.market}
               </Typography>
            )}
            {drawing.createdYear && (
               <Typography variant="caption" sx={{ bgcolor: 'info.light', color: 'info.contrastText', px: 0.8, py: 0.2, borderRadius: 1, fontSize: '0.65rem', fontWeight: 'bold' }}>
                 {drawing.createdYear}
               </Typography>
            )}
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 'auto', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.75rem', lineHeight: 1.4 }}>
            {drawing.description}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {(drawing.tags || []).slice(0, 3).map((tag, i) => (
              <Chip key={`${tag}-${i}`} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
            ))}
            {(drawing.tags || []).length > 3 && (
              <Chip label={`+${drawing.tags.length - 3}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
