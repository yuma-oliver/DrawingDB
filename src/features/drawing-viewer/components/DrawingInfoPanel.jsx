import { Box, Typography, Chip, Divider, Paper, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useDrawingStore } from '../../../store/drawingStore';

export default function DrawingInfoPanel() {
  const { selectedGroup, selectedPdf, viewerMode, setViewerMode } = useDrawingStore();

  if (!selectedGroup || !selectedPdf) return null;

  return (
    <Paper sx={{ p: 0, mb: 3, overflow: 'hidden', border: 1, borderColor: 'divider', borderRadius: 2 }} elevation={0}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Button 
          variant={viewerMode === 'original' ? "contained" : "outlined"} 
          size="small" 
          fullWidth 
          onClick={() => setViewerMode(viewerMode === 'original' ? 'group' : 'original')}
          sx={{ fontWeight: 'bold', borderRadius: 2 }}
          disableElevation
        >
          {viewerMode === 'original' ? '該当図面のみ表示に戻る' : '元図面ファイル全体を開く'}
        </Button>
      </Box>

      <Box sx={{ p: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.4, mb: 1.5 }}>
          {selectedGroup.title}
        </Typography>
        <Typography component="div" variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Chip label={selectedGroup.drawingType || '詳細図'} size="small" variant="outlined" sx={{ bgcolor: 'white' }} />
          P.{selectedGroup.startPage}{selectedGroup.startPage !== selectedGroup.endPage ? `-${selectedGroup.endPage}` : ''}
        </Typography>
      </Box>

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>Tags</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label={selectedGroup.mainTag || '未分類'} 
              color="primary" 
              sx={{ fontWeight: 'bold' }} 
            />
            {(selectedGroup.subTags || []).map(tag => (
              <Chip key={tag} label={tag} variant="outlined" />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1, bgcolor: 'grey.50', p: 1.5, borderRadius: 1, border: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" display="block" fontWeight="bold">信頼度スコア</Typography>
            <Typography variant="subtitle1" color={selectedGroup.confidence > 0.7 ? 'success.main' : 'warning.main'} fontWeight="bold" sx={{ mt: 0.5 }}>
              {selectedGroup.confidence !== undefined ? `${(selectedGroup.confidence * 100).toFixed(0)}%` : '-'}
            </Typography>
          </Box>
          <Box sx={{ flex: 2, bgcolor: 'grey.50', p: 1.5, borderRadius: 1, border: 1, borderColor: 'divider', minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" display="block" fontWeight="bold">案件名</Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={selectedPdf.projectName}>
              {selectedPdf.projectName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: -1 }}>
          <Box sx={{ flex: 1, bgcolor: 'grey.50', p: 1.5, borderRadius: 1, border: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" display="block" fontWeight="bold">5大市場</Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
              {selectedPdf.market || '-'}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, bgcolor: 'grey.50', p: 1.5, borderRadius: 1, border: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" display="block" fontWeight="bold">作成年</Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
              {selectedPdf.decade || '-'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Accordion disableGutters elevation={0} sx={{ border: 1, borderColor: 'divider', '&:before': { display: 'none' }, mb: 1 }}>
             <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'grey.50', minHeight: 'auto', '& .MuiAccordionSummary-content': { my: 1 } }}>
               <Typography variant="caption" fontWeight="bold" color="text.secondary">AI 自動生成説明</Typography>
             </AccordionSummary>
             <AccordionDetails sx={{ pt: 0, pb: 2, px: 2 }}>
               <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                 {selectedGroup.description}
               </Typography>
             </AccordionDetails>
          </Accordion>

          {selectedGroup.titleEvidence && (
            <Accordion disableGutters elevation={0} sx={{ border: 1, borderColor: 'divider', '&:before': { display: 'none' }, mb: 1 }}>
               <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'grey.50', minHeight: 'auto', '& .MuiAccordionSummary-content': { my: 1 } }}>
                 <Typography variant="caption" fontWeight="bold" color="text.secondary">開発者情報：タイトル抽出元</Typography>
               </AccordionSummary>
               <AccordionDetails sx={{ pt: 0, pb: 2, px: 2 }}>
                 <Typography variant="body2" sx={{ bgcolor: 'grey.100', p: 1.5, borderRadius: 1, fontFamily: 'monospace', fontSize: '0.8rem', borderLeft: 3, borderColor: 'primary.main', overflowX: 'auto' }}>
                   {selectedGroup.titleEvidence}
                 </Typography>
               </AccordionDetails>
            </Accordion>
          )}

          {selectedGroup.evidence && selectedGroup.evidence.length > 0 && (
            <Accordion disableGutters elevation={0} sx={{ border: 1, borderColor: 'divider', '&:before': { display: 'none' } }}>
               <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'grey.50', minHeight: 'auto', '& .MuiAccordionSummary-content': { my: 1 } }}>
                 <Typography variant="caption" fontWeight="bold" color="text.secondary">開発者情報：タグ根拠語句</Typography>
               </AccordionSummary>
               <AccordionDetails sx={{ pt: 0, pb: 2, px: 2 }}>
                 <Typography variant="body2" sx={{ bgcolor: 'grey.100', p: 1.5, borderRadius: 1, fontFamily: 'monospace', fontSize: '0.8rem', maxHeight: 150, overflowY: 'auto' }}>
                   {typeof selectedGroup.evidence[0] === 'string' 
                     ? selectedGroup.evidence.join('\n') 
                     : selectedGroup.evidence.map(e => `${e.word} (P.${e.page})`).join('\n')
                   }
                 </Typography>
               </AccordionDetails>
            </Accordion>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
