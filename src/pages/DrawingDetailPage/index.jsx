import { Box, Grid, Button, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDrawingStore } from '../../store/drawingStore';
import PageThumbnailList from '../../features/drawing-viewer/components/PageThumbnailList';
import DrawingPreviewPanel from '../../features/drawing-viewer/components/DrawingPreviewPanel';
import DrawingInfoPanel from '../../features/drawing-viewer/components/DrawingInfoPanel';
import SimilarDrawingsPanel from '../../features/drawing-similar/components/SimilarDrawingsPanel';

export default function DrawingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectGroupById, selectedGroup, clearSelection } = useDrawingStore();

  useEffect(() => {
    if (id) {
      selectGroupById(id);
    }
    return () => clearSelection();
  }, [id, selectGroupById, clearSelection]);

  if (!selectedGroup) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>図面が見つかりません</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>戻る</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* メインレイアウト */}
      <Box sx={{ display: 'flex', flexGrow: 1, gap: 2, overflow: 'hidden' }}>
        {/* 左ペイン：サムネイル */}
        <Box sx={{ width: 260, flexShrink: 0 }}>
          <PageThumbnailList />
        </Box>

        {/* 中央ペイン：PDFプレビュー */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <DrawingPreviewPanel />
        </Box>

        {/* 右ペイン：情報と類似図面 */}
        <Box sx={{ width: 320, flexShrink: 0, overflowY: 'auto', pr: 1 }}>
          <DrawingInfoPanel />
          <SimilarDrawingsPanel />
        </Box>
      </Box>
    </Box>
  );
}
