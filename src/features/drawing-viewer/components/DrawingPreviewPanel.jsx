import { Box, Paper, Typography, IconButton } from '@mui/material';
import { ZoomIn, ZoomOut, Fullscreen } from '@mui/icons-material';
import { useDrawingStore } from '../../../store/drawingStore';

export default function DrawingPreviewPanel() {
  const { selectedDrawing, selectedPage } = useDrawingStore();

  if (!selectedDrawing) return null;

  return (
    <Paper sx={{ flexGrow: 1, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: '#e0e0e0' }}>
      {/* ツールバー */}
      <Box sx={{ p: 1, display: 'flex', gap: 1, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="body2" sx={{ my: 'auto', ml: 1, fontWeight: 'bold' }}>
          {selectedPage ? `ページ ${selectedPage.pageNum} : ${selectedPage.type}` : 'ページを選択してください'}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton size="small"><ZoomOut /></IconButton>
        <Typography variant="body2" sx={{ my: 'auto', px: 1 }}>100%</Typography>
        <IconButton size="small"><ZoomIn /></IconButton>
        <IconButton size="small"><Fullscreen /></IconButton>
      </Box>
      
      {/* プレビュー領域 */}
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {selectedDrawing.pdfUrl ? (
          <Box sx={{ width: '100%', height: '100%', p: 2 }}>
            <iframe 
               src={`${selectedDrawing.pdfUrl}#toolbar=0&navpanes=0`} 
               width="100%" 
               height="100%" 
               style={{ border: 'none', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
               title="PDF Preview"
            />
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', height: '100%' }}>
            <Paper 
              elevation={3} 
              sx={{ 
                width: '100%', 
                maxWidth: 800, 
                aspectRatio: '1 / 1.414', // A判比率
                bgcolor: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                maxHeight: '100%'
              }}
            >
              <Typography variant="h4" color="text.disabled" sx={{ mb: 2 }}>
                PDF Preview Area
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {selectedDrawing.title}
              </Typography>
              {selectedPage && (
                <Typography variant="body2" color="text.secondary">
                  P.{selectedPage.pageNum} - {selectedPage.type}
                </Typography>
              )}
              <Box sx={{ mt: 4, width: '80%', height: '60%', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                図面内容（将来的に PDF.js 等でレンダリングします）
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
