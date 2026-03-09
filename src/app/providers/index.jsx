import { ThemeProvider, createTheme } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import CssBaseline from '@mui/material/CssBaseline';

// 落ち着いた業務システム風のテーマ
const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50', // 落ち着いたダークブルー
    },
    secondary: {
      main: '#18BC9C', // アクセントカラーのグリーン
    },
    background: {
      default: '#F8F9FA', // 薄いグレー背景
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none', // ボタンの大文字化を防ぐ
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default function AppProvider() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
