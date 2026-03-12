import { Box, Typography, Button, Container, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { RocketLaunch as RocketIcon, AutoGraph as AutoGraphIcon, Search as SearchIcon } from '@mui/icons-material';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', color: 'white', overflow: 'hidden', position: 'relative' }}>
      <AppBar position="fixed" elevation={0} sx={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="span" sx={{ color: '#38bdf8' }}>DDB</Box> 造作図面検索
          </Typography>
          {user ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" color="inherit" onClick={handleGoToDashboard} sx={{ borderRadius: 8, textTransform: 'none', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: '#fff' } }}>
                ダッシュボードへ
              </Button>
              <Button variant="text" color="inherit" onClick={() => logout()} sx={{ borderRadius: 8, textTransform: 'none', '&:hover': { color: '#f87171', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                ログアウト
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" onClick={() => navigate('/login')} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', borderRadius: 8, textTransform: 'none', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                ログイン
              </Button>
              <Button variant="contained" onClick={() => navigate('/register')} sx={{ bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', borderRadius: 8, textTransform: 'none', '&:hover': { bgcolor: '#7dd3fc' } }}>
                アカウント作成
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: { xs: 15, md: 20 }, pb: 10, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
          <Typography variant="h1" fontWeight="900" sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, mb: 3, background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            図面管理を、<br />もっとスマートに。
          </Typography>
          <Typography variant="h6" sx={{ color: '#94a3b8', mb: 6, fontWeight: 'normal', lineHeight: 1.6 }}>
            AIが図面データのテキストを自動解析し、タグ付けと分類を自動化。膨大な造作図面の中から、目的の図面を瞬時に見つけ出します。
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            {user ? (
              <Button variant="contained" size="large" onClick={handleGoToDashboard} sx={{ bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', px: 6, py: 2, borderRadius: 8, fontSize: '1.1rem', '&:hover': { bgcolor: '#7dd3fc' } }}>
                ダッシュボードを開く
              </Button>
            ) : (
              <Button variant="contained" size="large" onClick={() => navigate('/register')} sx={{ bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', px: 6, py: 2, borderRadius: 8, fontSize: '1.1rem', border: '1px solid transparent', '&:hover': { bgcolor: '#7dd3fc' }, boxShadow: '0 4px 14px 0 rgba(56,189,248,0.39)' }}>
                無料で登録して試す
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 10, md: 15 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {/* Features */}
          <Box sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', bgcolor: 'rgba(255,255,255,0.05)' } }}>
            <SearchIcon sx={{ fontSize: 40, color: '#38bdf8', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>圧倒的な検索スピード</Typography>
            <Typography color="#94a3b8" variant="body2" sx={{ lineHeight: 1.6 }}>独自のインデックス技術により、数千枚の図面から一瞬で目的のファイルを見つけ出します。</Typography>
          </Box>
          <Box sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', bgcolor: 'rgba(255,255,255,0.05)' } }}>
            <AutoGraphIcon sx={{ fontSize: 40, color: '#818cf8', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>AIによる自動タグ付け</Typography>
            <Typography color="#94a3b8" variant="body2" sx={{ lineHeight: 1.6 }}>アップロードするだけで、AIが図面内のテキストを解析し、市場や用途を自動で分類します。</Typography>
          </Box>
          <Box sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', bgcolor: 'rgba(255,255,255,0.05)' } }}>
            <RocketIcon sx={{ fontSize: 40, color: '#c084fc', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>シームレスな一括登録</Typography>
            <Typography color="#94a3b8" variant="body2" sx={{ lineHeight: 1.6 }}>ドラッグ＆ドロップで複数ファイルを一括アップロード。面倒な手作業を極限まで削減。</Typography>
          </Box>
        </Box>
      </Container>
      
      {/* Background decorations */}
      <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(15,23,42,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(129,140,248,0.1) 0%, rgba(15,23,42,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
    </Box>
  );
}
