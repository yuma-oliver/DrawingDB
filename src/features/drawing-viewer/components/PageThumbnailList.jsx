import { List, ListItem, ListItemButton, ListItemText, Typography, Paper, Box, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useDrawingStore } from '../../../store/drawingStore';
import { useSearchStore } from '../../../store/searchStore';
import { useNavigate } from 'react-router-dom';

export default function PageThumbnailList() {
  const { selectedPdf, selectedGroup } = useDrawingStore();
  const { results } = useSearchStore();
  const navigate = useNavigate();

  if (!selectedPdf || !selectedGroup) return null;

  // 検索結果を信頼度スコア降順でソート
  const sortedResults = [...results].sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

  return (
    <Paper sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRight: 1, borderColor: 'divider', borderRadius: 0 }} elevation={0}>
      <Box sx={{ p: 1, px: 2, bgcolor: '#1a1a1a', color: 'white', display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <IconButton size="small" sx={{ color: 'white', ml: -1 }} onClick={() => navigate('/search')}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ flexGrow: 1 }}>
          関連する図面候補
        </Typography>
        <Typography variant="caption" sx={{ bgcolor: 'rgba(255,255,255,0.2)', px: 1, py: 0.5, borderRadius: 1 }}>
          {sortedResults.length}件
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0, bgcolor: 'grey.50' }}>
        {sortedResults.length === 0 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">検索結果がありません</Typography>
          </Box>
        )}
        {sortedResults.map((group) => (
          <ListItem key={group.id} disablePadding divider sx={{ bgcolor: selectedGroup?.id === group.id ? 'primary.50' : 'transparent' }}>
            <ListItemButton
              selected={selectedGroup?.id === group.id}
              onClick={() => navigate(`/drawings/${group.id}`)}
              sx={{ py: 1.5, px: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <Box
                    component="img"
                    src={group.thumbnail}
                    sx={{
                      width: 56,
                      height: 56,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '2px solid',
                      borderColor: selectedGroup?.id === group.id ? 'primary.main' : 'grey.300',
                      bgcolor: 'white'
                    }}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: -6, 
                    right: -6, 
                    bgcolor: 'background.paper', 
                    px: 0.5, 
                    borderRadius: 1,
                    border: 1, 
                    borderColor: 'divider',
                    boxShadow: 1
                  }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.65rem' }}>
                      {group.startPage === group.endPage ? `P.${group.startPage}` : `${group.startPage}-${group.endPage}`}
                    </Typography>
                  </Box>
                </Box>
                
                <ListItemText
                  primary={group.title ? group.title.replace(/\s+/g, ' ') : ''}
                  secondary={group.mainTag || '未分類'}
                  primaryTypographyProps={{ 
                    variant: 'body2', 
                    fontWeight: selectedGroup?.id === group.id ? 'bold' : 'medium', 
                    color: selectedGroup?.id === group.id ? 'primary.main' : 'text.primary',
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    lineHeight: 1.3,
                    maxHeight: '2.6em',
                    wordBreak: 'break-all',
                    mb: 0.5
                  }}
                  secondaryTypographyProps={{ 
                    variant: 'caption', 
                    color: 'text.secondary',
                    fontWeight: 'bold',
                    sx: { display: 'inline-block', bgcolor: 'grey.200', px: 1, borderRadius: 1 }
                  }}
                />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
