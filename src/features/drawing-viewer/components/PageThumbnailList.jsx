import { List, ListItem, ListItemButton, ListItemText, Typography, Paper, Box } from '@mui/material';
import { useDrawingStore } from '../../../store/drawingStore';

export default function PageThumbnailList() {
  const { selectedDrawing, selectedPage, selectPage } = useDrawingStore();

  if (!selectedDrawing || !selectedDrawing.pages) return null;

  return (
    <Paper sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="subtitle2" fontWeight="bold">ページ一覧</Typography>
      </Box>
      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
        {selectedDrawing.pages.map((page) => (
          <ListItem key={page.id} disablePadding divider>
            <ListItemButton
              selected={selectedPage?.id === page.id}
              onClick={() => selectPage(page)}
              sx={{ py: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 50,
                    bgcolor: 'grey.200',
                    border: '1px solid',
                    borderColor: selectedPage?.id === page.id ? 'primary.main' : 'grey.400',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="caption">{page.pageNum}</Typography>
                </Box>
                <ListItemText
                  primary={`P.${page.pageNum}`}
                  secondary={page.type}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: selectedPage?.id === page.id ? 'bold' : 'normal' }}
                  secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
