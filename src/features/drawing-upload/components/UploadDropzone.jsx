import { Box, Typography, Button, Paper } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Add as AddIcon } from '@mui/icons-material';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../../../store/searchStore';

export default function UploadDropzone() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { addDrawing } = useSearchStore();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = (file) => {
    if (file && file.type === 'application/pdf') {
      const newId = Date.now().toString();
      const pdfUrl = URL.createObjectURL(file);
      
      const newDrawing = {
        id: newId,
        title: file.name.replace(/\.[^/.]+$/, ""), // 拡張子を削除してタイトルに
        projectName: '未設定の案件',
        tags: ['新規'],
        description: 'アップロードされたばかりの図面データです。',
        pageCount: 1, // PDFのページ数を取得するにはライブラリが必要なため仮で1
        thumbnail: 'https://placehold.co/600x400/E3F2FD/1565C0?text=NEW+PDF', 
        drawingType: 'Plan',
        note: '',
        pdfUrl: pdfUrl, // iframe用にURLを保持
        pages: [
          { id: `${newId}-1`, pageNum: 1, type: '全体' }
        ]
      };
      
      addDrawing(newDrawing);
      navigate(`/drawings/${newId}`);
    } else {
      alert('PDFファイルを選択してください。');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    // 同じファイルを再度選べるようにクリアしておく
    e.target.value = null;
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>新規図面登録</Typography>

      <Paper
        variant="outlined"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={handleClick}
        sx={{
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: isDragOver ? 'secondary.main' : 'primary.main',
          borderRadius: 2,
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isDragOver ? 'rgba(24, 188, 156, 0.1)' : 'background.default',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'action.hover',
            cursor: 'pointer'
          }
        }}
      >
        <input 
          type="file" 
          accept="application/pdf" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
        
        <CloudUploadIcon color={isDragOver ? "secondary" : "primary"} sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h6" gutterBottom color={isDragOver ? "secondary.main" : "text.primary"}>
          PDFファイルをドラッグ＆ドロップするか、クリックして選択してください
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          最大サイズ: 100MB (PDF形式のみ対応)
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 8, px: 4 }}
          onClick={(e) => {
            e.stopPropagation(); // 親のクリックイベントを発火させない
            handleClick();
          }}
        >
          ファイルを選択
        </Button>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>ファイル要件（今後の拡張用）</Typography>
        <Typography variant="body2" color="text.secondary">
          ・図面はベクターデータが保持されたPDFを推奨します<br />
          ・スキャンデータの場合、OCR処理を追加で実行する機能が将来的に実装予定です<br />
          ・複数ファイルの同時アップロードにも今後対応予定です
        </Typography>
      </Box>
    </Box>
  );
}
