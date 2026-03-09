import { Box, Typography, Button, Paper, CircularProgress, LinearProgress } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Add as AddIcon, AutoFixHigh as AutoFixHighIcon } from '@mui/icons-material';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../../../store/searchStore';
import { analyzeTagsAndTitle } from '../../../shared/utils/tagging';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function UploadDropzone() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { addPdf } = useSearchStore();
  const [isDragOver, setIsDragOver] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFile = async (file) => {
    if (file && file.type === 'application/pdf') {
      setIsProcessing(true);
      setProgress(0);
      setStatusMessage('PDFをアップロード中...');

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        let extractedData = [];

        setStatusMessage('AIがページ構造とテキストを解析中...');
        for (let i = 1; i <= numPages; i++) {
          try {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const textLines = textContent.items.map(item => item.str).join(' ');
            
            // サムネイル生成
            const viewport = page.getViewport({ scale: 0.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport }).promise;
            const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);

            extractedData.push({ 
              pageNum: i, 
              text: textLines, 
              items: textContent.items,
              thumbnail: thumbnailDataUrl 
            });
          } catch (err) {
            console.warn(`Failed to extract text from page ${i}`, err);
          }
          setProgress((i / numPages) * 100);
        }

        setStatusMessage('解析完了！');
        await new Promise(r => setTimeout(r, 500));
        
        finalizeUpload(file, numPages, extractedData);
      } catch (e) {
        console.error("Failed to process PDF", e);
        alert('PDFファイルの処理中にエラーが発生しました。');
        setIsProcessing(false);
      }
    } else {
      alert('PDFファイルを選択してください。');
    }
  };

  const finalizeUpload = (file, numPages, extractedData) => {
    const newPdfId = `pdf-${Date.now()}`;
    const pdfUrl = URL.createObjectURL(file);
    
    let groups = [];
    
    let currentStart = 1;
    let groupIndex = 1;
    
    while (currentStart <= numPages) {
      // 現在はルールベースでテキスト抽出を行いますが、
      // POCとしての複数グループ生成をシミュレートするためページはランダム区切りにします。
      const groupSize = Math.floor(Math.random() * 3) + 1; 
      const currentEnd = Math.min(currentStart + groupSize - 1, numPages);
      const pagesArray = Array.from({ length: currentEnd - currentStart + 1 }, (_, i) => currentStart + i);
      let combinedPages = [];
      pagesArray.forEach(p => {
        const pageData = extractedData.find(d => d.pageNum === p);
        if (pageData) combinedPages.push(pageData);
      });

      // カスタム辞書とルールによるスコアリングタグ解析とタイトル抽出の実行
      const tagData = analyzeTagsAndTitle(combinedPages);
      
      groups.push({
        id: `${newPdfId}-g${groupIndex}`,
        startPage: currentStart,
        endPage: currentEnd,
        pageIds: pagesArray.map(p => `p${p}`),
        pages: pagesArray,
        ...tagData, // title, titleEvidence, mainTag, subTags, drawingType, spaceTags, attributeTags, evidence, confidence, tags を展開
        description: `AIによってテキストが解析され、自動分類・抽出された図面セット（P.${currentStart}〜P.${currentEnd}）です。`,
        thumbnail: combinedPages.length > 0 && combinedPages[0].thumbnail ? combinedPages[0].thumbnail : `https://placehold.co/400x565/E3F2FD/1565C0?text=Set+${groupIndex}`,
      });
      
      currentStart = currentEnd + 1;
      groupIndex++;
    }

    const newPdf = {
      id: newPdfId,
      title: file.name,
      projectName: '未設定の案件',
      pdfUrl: pdfUrl,
      groups: groups
    };
    
    addPdf(newPdf);
    setIsProcessing(false);
    navigate(`/drawings/${groups[0].id}`);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = null;
  };

  const onDragOver = (e) => {
    e.preventDefault();
    if (!isProcessing) setIsDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isProcessing) {
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    }
  };

  const handleClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
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
          pointerEvents: isProcessing ? 'none' : 'auto',
          '&:hover': {
            bgcolor: isProcessing ? 'background.default' : 'action.hover',
            cursor: isProcessing ? 'default' : 'pointer'
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
        
        {isProcessing ? (
          <Box sx={{ width: '100%', maxWidth: 400, textAlign: 'center', py: 2 }}>
            <AutoFixHighIcon color="secondary" sx={{ fontSize: 64, mb: 2, animation: 'spin 3s linear infinite' }} />
            <Typography variant="h6" gutterBottom color="secondary.main" fontWeight="bold">
              {statusMessage}
            </Typography>
            <Box sx={{ width: '100%', mt: 3, mb: 1 }}>
              <LinearProgress variant="determinate" value={progress} color="secondary" sx={{ height: 10, borderRadius: 5 }} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {Math.floor(progress)}% 完了
            </Typography>
          </Box>
        ) : (
          <>
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
                e.stopPropagation();
                handleClick();
              }}
            >
              ファイルを選択
            </Button>
          </>
        )}
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
