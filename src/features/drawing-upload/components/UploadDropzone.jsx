import { Box, Typography, Button, Paper, CircularProgress, LinearProgress, TextField, Select, MenuItem, FormControl, InputLabel, Divider, Autocomplete } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Add as AddIcon, AutoFixHigh as AutoFixHighIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../../../store/searchStore';
import { useAuthStore } from '../../../store/authStore';
import { analyzeTagsAndTitle } from '../../../shared/utils/tagging';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MARKETS = ['オフィス', 'ホテル', 'レストラン', '医療・福祉', '公共・商業'];
const YEARS = Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => `${new Date().getFullYear() - i}年`);

export default function UploadDropzone() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { addPdf, allDocs } = useSearchStore();
  const [isDragOver, setIsDragOver] = useState(false);
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [market, setMarket] = useState('オフィス');
  const [createdYear, setCreatedYear] = useState(`${new Date().getFullYear()}年`);
  const [drawingType, setDrawingType] = useState('自動判定（AI）');
  const { user } = useAuthStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const projectNames = [...new Set(allDocs.map(doc => doc.projectName).filter(Boolean))];

  const handleStartUpload = async () => {
    if (selectedFiles.length > 0) {
      setIsProcessing(true);
      
      let allNewGroups = [];
      let totalFiles = selectedFiles.length;

      for (let fileIndex = 0; fileIndex < totalFiles; fileIndex++) {
        const file = selectedFiles[fileIndex];
        setProgress(0);
        setStatusMessage(`[${fileIndex + 1}/${totalFiles}] ${file.name} をアップロード中...`);

        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          const numPages = pdf.numPages;
          let extractedData = [];

          setStatusMessage(`[${fileIndex + 1}/${totalFiles}] AIが${file.name}のテキストを解析中...`);
          for (let i = 1; i <= numPages; i++) {
            try {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const textLines = textContent.items.map(item => item.str).join(' ');
              
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

          setStatusMessage(`[${fileIndex + 1}/${totalFiles}] 解析完了！保存しています...`);
          await new Promise(r => setTimeout(r, 500));
          
          const newGroups = finalizeSingleUpload(file, numPages, extractedData);
          allNewGroups = [...allNewGroups, ...newGroups];
        } catch (e) {
          console.error(`Failed to process PDF ${file.name}`, e);
          alert(`${file.name} の処理中にエラーが発生しました。スキップします。`);
        }
      }
      
      setIsProcessing(false);
      setSelectedFiles([]);
      if (allNewGroups.length > 0) {
        navigate(`/drawings/${allNewGroups[0].id}`);
      }
    } else {
      alert('PDFファイルを選択してください。');
    }
  };

  const finalizeSingleUpload = (file, numPages, extractedData) => {
    const newPdfId = `pdf-${Date.now()}`;
    const pdfUrl = URL.createObjectURL(file);
    
    let groups = [];
    let currentStart = 1;
    let groupIndex = 1;
    
    while (currentStart <= numPages) {
      // ランダム区切り
      const groupSize = Math.floor(Math.random() * 3) + 1; 
      const currentEnd = Math.min(currentStart + groupSize - 1, numPages);
      const pagesArray = Array.from({ length: currentEnd - currentStart + 1 }, (_, i) => currentStart + i);
      let combinedPages = [];
      pagesArray.forEach(p => {
        const pageData = extractedData.find(d => d.pageNum === p);
        if (pageData) combinedPages.push(pageData);
      });

      const tagData = analyzeTagsAndTitle(combinedPages);
      
      groups.push({
        id: `${newPdfId}-g${groupIndex}`,
        startPage: currentStart,
        endPage: currentEnd,
        pageIds: pagesArray.map(p => `p${p}`),
        pages: pagesArray,
        ...tagData,
        drawingType: drawingType !== '自動判定（AI）' ? drawingType : tagData.drawingType, 
        description: `AIによってテキストが解析され、自動分類・抽出された図面セット（P.${currentStart}〜P.${currentEnd}）です。`,
        thumbnail: combinedPages.length > 0 && combinedPages[0].thumbnail ? combinedPages[0].thumbnail : `https://placehold.co/400x565/E3F2FD/1565C0?text=Set+${groupIndex}`,
      });
      
      currentStart = currentEnd + 1;
      groupIndex++;
    }

    const newPdf = {
      id: newPdfId,
      title: file.name,
      projectName: projectName || file.name.replace(/\.pdf$/i, ''),
      market: market,
      decade: createdYear,
      pdfUrl: pdfUrl,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      uploaderName: user?.username || 'ゲスト',
      groups: groups
    };
    
    
    addPdf(newPdf);
    return groups;
  };

  const processAddedFiles = (files) => {
    const newFiles = [];
    const duplicates = [];

    files.forEach(file => {
      // 既にアップロード済みの図面（allDocs）に同名・同サイズのものがないか判定
      const isAlreadyInStore = allDocs.some(doc => 
        doc.title === file.name && (doc.fileSize ? doc.fileSize === file.size : true)
      );
      // 既に枠に追加されている図面（selectedFiles）に同名・同サイズのものがないか判定
      const isAlreadySelected = selectedFiles.some(f => 
        f.name === file.name && f.size === file.size
      );
      
      if (isAlreadyInStore || isAlreadySelected) {
        duplicates.push(file.name);
      } else {
        newFiles.push(file);
      }
    });

    if (duplicates.length > 0) {
      alert(`重複を検知したため、以下のファイルは追加をスキップしました：\n${duplicates.join('\n')}`);
    }

    if (newFiles.length > 0) {
       const updatedSelectedFiles = [...selectedFiles, ...newFiles];
       setSelectedFiles(updatedSelectedFiles);
       
       if (!projectName && updatedSelectedFiles.length === 1) {
           setProjectName(updatedSelectedFiles[0].name.replace(/\.pdf$/i, ''));
       } else if (updatedSelectedFiles.length > 1 && projectName === selectedFiles[0]?.name.replace(/\.pdf$/i, '')) {
           setProjectName('');
       }
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    if (files.length > 0) {
       processAddedFiles(files);
    } else if (e.target.files.length > 0) {
       alert('PDFファイルのみ選択可能です。');
    }
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
      const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
      if (files.length > 0) {
         processAddedFiles(files);
      } else if (e.dataTransfer.files.length > 0) {
         alert('PDFファイルのみ選択可能です。');
      }
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

      {selectedFiles.length === 0 ? (
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
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }}
        >
          <input 
            type="file" 
            accept="application/pdf" 
            multiple
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
          />
          <CloudUploadIcon color={isDragOver ? "secondary" : "primary"} sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h6" gutterBottom color={isDragOver ? "secondary.main" : "text.primary"}>
            PDFファイルをドラッグ＆ドロップするか、クリックして選択してください（複数選択可）
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
        </Paper>
      ) : isProcessing ? (
        <Paper variant="outlined" sx={{ p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
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
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, borderColor: 'primary.main', borderWidth: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 4 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 32, mt: 0.5 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {selectedFiles.length} 件のファイルが選択されています
              </Typography>
              <Box sx={{ maxHeight: 100, overflowY: 'auto', mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                {selectedFiles.map((f, idx) => (
                  <Typography key={idx} variant="body2" color="text.secondary" noWrap>
                    {idx + 1}. {f.name}
                  </Typography>
                ))}
              </Box>
            </Box>
            <Button variant="outlined" size="small" onClick={() => setSelectedFiles([])}>クリア</Button>
            <Button variant="contained" size="small" onClick={handleClick} startIcon={<AddIcon />}>追加</Button>
            <input 
              type="file" 
              accept="application/pdf" 
              multiple
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
          </Box>


          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>図面の基本情報を入力してください</Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
            <Autocomplete
              freeSolo
              options={projectNames}
              value={projectName}
              onChange={(e, newValue) => setProjectName(newValue || '')}
              onInputChange={(e, newInputValue) => setProjectName(newInputValue)}
              renderInput={(params) => (
                <TextField 
                  {...params}
                  label="案件名" 
                  variant="outlined" 
                  fullWidth 
                  size="small"
                  placeholder="例: OOOホテル新築工事"
                  helperText={selectedFiles.length > 1 ? "空欄の場合、それぞれのファイル名が案件名になります（入力すると全ファイルに共通の案件名が設定されます）" : "アップロード済みの案件名がある場合は後から統合できます"}
                />
              )}
            />
            <TextField
              label="登録者名（自動セット）"
              variant="outlined"
              fullWidth
              size="small"
              value={user?.username || 'ゲスト'}
              disabled
              helperText="ログイン中のユーザー名が自動で設定されます"
            />
            
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <FormControl sx={{ flex: 1, minWidth: 200 }} size="small">
                <InputLabel>5大市場</InputLabel>
                <Select
                  value={market}
                  label="5大市場"
                  onChange={(e) => setMarket(e.target.value)}
                >
                  {MARKETS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1, minWidth: 200 }} size="small">
                <InputLabel>作成年</InputLabel>
                <Select
                  value={createdYear}
                  label="作成年"
                  onChange={(e) => setCreatedYear(e.target.value)}
                >
                  {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1, minWidth: 200 }} size="small">
                <InputLabel>図面種別</InputLabel>
                <Select
                  value={drawingType}
                  label="図面種別"
                  onChange={(e) => setDrawingType(e.target.value)}
                >
                  <MenuItem value="自動判定（AI）">自動判定（AIに任せる）</MenuItem>
                  <MenuItem value="家具図">家具図として登録</MenuItem>
                  <MenuItem value="什器図">什器図として登録</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large" 
              color="primary"
              onClick={handleStartUpload}
              sx={{ px: 6, py: 1.5, fontWeight: 'bold' }}
            >
              AI解析とアップロードを開始
            </Button>
          </Box>
        </Paper>
      )}

      {!isProcessing && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>ファイル要件（今後の拡張用）</Typography>
          <Typography variant="body2" color="text.secondary">
            ・図面はベクターデータが保持されたPDFを推奨します<br />
            ・長時間のアップロードを要する大量ファイルのバックグラウンド処理に対応予定です<br />
            ・スキャンデータの場合、OCR処理を追加で実行する機能が将来的に実装予定です
          </Typography>
        </Box>
      )}
    </Box>
  );
}
