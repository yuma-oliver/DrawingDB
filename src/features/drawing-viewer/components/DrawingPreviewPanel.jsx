import { Box, Paper, Typography, IconButton, CircularProgress, TextField, Button } from '@mui/material';
import { ZoomIn, ZoomOut, Fullscreen } from '@mui/icons-material';
import { useDrawingStore } from '../../../store/drawingStore';
import { Document, Page, pdfjs } from 'react-pdf';
import { useState, useRef, useEffect } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Web Workerの設定
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function DrawingPreviewPanel() {
  const { selectedPdf, selectedGroup, viewerMode, selectedGroupPage, setGroupPage } = useDrawingStore();
  const [zoomLevel, setZoomLevel] = useState(1.0); // 1.0 represents 100% in UI
  const [originalPageInput, setOriginalPageInput] = useState('');
  const [appliedOriginalPage, setAppliedOriginalPage] = useState(null);

  useEffect(() => {
    if (viewerMode === 'original' && selectedGroup?.startPage) {
      setAppliedOriginalPage(selectedGroup.startPage);
      setOriginalPageInput(String(selectedGroup.startPage));
    }
  }, [viewerMode, selectedGroup]);

  if (!selectedPdf) return null;

  const handleZoomIn = () => setZoomLevel(z => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoomLevel(z => Math.max(z - 0.2, 0.4));

  return (
    <Paper sx={{ flexGrow: 1, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: '#323639', borderRadius: 2 }} elevation={0}>
      {/* ツールバー */}
      <Box sx={{ p: 1, display: 'flex', gap: 1, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%' }} title={viewerMode === 'original' ? `元図面: ${selectedPdf.title}` : selectedGroup ? `${selectedGroup.title} (P.${selectedGroup.startPage}${selectedGroup.startPage !== selectedGroup.endPage ? `-${selectedGroup.endPage}` : ''})` : '図面セットを選択してください'}>
          {viewerMode === 'original'
            ? `元図面: ${selectedPdf.title}`
            : selectedGroup 
              ? `${selectedGroup.title} (P.${selectedGroup.startPage}${selectedGroup.startPage !== selectedGroup.endPage ? `-${selectedGroup.endPage}` : ''})` 
              : '図面セットを選択してください'}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {viewerMode === 'original' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
            <Typography variant="body2" color="text.secondary">表示ページ:</Typography>
            <TextField 
              size="small"
              type="number"
              value={originalPageInput}
              onChange={(e) => setOriginalPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = parseInt(originalPageInput, 10);
                  if (val > 0) setAppliedOriginalPage(val);
                }
              }}
              sx={{ width: 70, '& .MuiInputBase-input': { p: '4px 8px', fontSize: '0.875rem' } }}
            />
            <Button variant="outlined" size="small" onClick={() => {
              const val = parseInt(originalPageInput, 10);
              if (val > 0) setAppliedOriginalPage(val);
            }} sx={{ py: 0.2, px: 1, minWidth: 0, fontSize: '0.75rem' }}>
              移動
            </Button>
          </Box>
        )}
        {viewerMode === 'group' && (
          <>
            <IconButton size="small" onClick={handleZoomOut}><ZoomOut /></IconButton>
            <Typography variant="body2" sx={{ my: 'auto', px: 1 }}>{Math.round(zoomLevel * 100)}%</Typography>
            <IconButton size="small" onClick={handleZoomIn}><ZoomIn /></IconButton>
          </>
        )}
        <IconButton size="small"><Fullscreen /></IconButton>
      </Box>
      
      {/* プレビュー領域 */}
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        {selectedPdf.pdfUrl ? (
          viewerMode === 'original' ? (
            <Box sx={{ width: '100%', height: '100%', p: 2 }}>
              <iframe 
                 key={`pdf-iframe-${appliedOriginalPage || selectedGroup?.startPage || 1}`}
                 src={`${selectedPdf.pdfUrl}#page=${appliedOriginalPage || selectedGroup?.startPage || 1}&toolbar=0&navpanes=0`} 
                 width="100%" 
                 height="100%" 
                 style={{ border: 'none', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                 title="PDF Preview"
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
              {/* グループ内ページサムネイル領域 (左側) */}
              {selectedGroup && selectedGroup.pages && selectedGroup.pages.length > 1 && (
                <Box sx={{ width: 90, flexShrink: 0, bgcolor: 'rgba(0,0,0,0.2)', borderRight: 1, borderColor: 'rgba(255,255,255,0.1)', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, gap: 2 }}>
                  {selectedGroup.pages.map(pageNum => (
                    <Box 
                      key={pageNum}
                      onClick={() => setGroupPage(pageNum)}
                      sx={{ 
                        width: 60, height: 84, bgcolor: 'white', border: '2px solid', 
                        borderColor: selectedGroupPage === pageNum ? 'primary.light' : 'transparent', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        transform: selectedGroupPage === pageNum ? 'scale(1.05)' : 'none',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: selectedGroupPage === pageNum ? '0 0 12px rgba(24, 188, 156, 0.5)' : 1,
                        opacity: selectedGroupPage === pageNum ? 1 : 0.7,
                        '&:hover': { opacity: 1, transform: 'scale(1.05)', boxShadow: 2 }
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold" color="text.secondary">
                        P.{pageNum}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
              {/* メインビューア */}
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 4, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ m: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <Document
                    file={selectedPdf.pdfUrl}
                    loading={<CircularProgress sx={{ m: 4 }} />}
                    error={<Typography sx={{ p: 4, color: 'error.main' }}>PDFの読み込みに失敗しました。</Typography>}
                  >
                    {selectedGroupPage && (
                      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Paper elevation={8} sx={{ display: 'inline-flex', bgcolor: 'white', overflow: 'hidden' }}>
                          <Page 
                            pageNumber={selectedGroupPage} 
                            scale={zoomLevel * 0.8} 
                            renderTextLayer={true} 
                            renderAnnotationLayer={true}
                            loading={<CircularProgress sx={{ m: 4 }} />}
                          />
                        </Paper>
                        <Box sx={{ mt: 2, bgcolor: 'rgba(0,0,0,0.6)', px: 2, py: 0.5, borderRadius: 4 }}>
                           <Typography variant="caption" color="white" fontWeight="bold">
                             Page {selectedGroupPage}
                           </Typography>
                        </Box>
                      </Box>
                    )}
                  </Document>
                </Box>
              </Box>
            </Box>
          )
        ) : (
          <Box sx={{ flexGrow: 1, p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', height: '100%' }}>
            <Paper 
              elevation={3} 
              sx={{ 
                width: '100%', 
                maxWidth: 800, 
                aspectRatio: '1 / 1.414',
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
                {selectedPdf.title}
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
