import { Box, Typography, Button, TextField, Container, Paper, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // モックログイン
    setUser({ id: 'u-001', username: '谷岡 佑馬' });
    navigate('/dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, position: 'relative', overflow: 'hidden' }}>
      <IconButton sx={{ position: 'absolute', top: 20, left: 20, color: 'white', zIndex: 2 }} onClick={() => navigate('/')}>
        <ArrowBack />
      </IconButton>
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 1 }}>お帰りなさい</Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4, color: '#94a3b8' }}>
            アカウントにログインして続行
          </Typography>

          <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField 
                fullWidth 
                label="メールアドレス" 
                variant="outlined" 
                defaultValue="demo@example.com"
                sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#38bdf8' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
              />
              <TextField 
                fullWidth 
                label="パスワード" 
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                defaultValue="password123"
                sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#38bdf8' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#94a3b8' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 2, bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', '&:hover': { bgcolor: '#7dd3fc' }, borderRadius: 2 }}>
                ログイン（デモ）
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              アカウントをお持ちでない場合は{' '}
              <Link to="/register" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>登録</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
      
      <Box sx={{ position: 'absolute', top: '10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(15,23,42,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
    </Box>
  );
}
