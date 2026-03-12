import { AppBar, Box, Button, CssBaseline, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Avatar } from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon, UploadFile as UploadIcon, FormatListBulleted as ListIcon, Person as PersonIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const drawerWidth = 240;
const miniDrawerWidth = 72;

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(() => {
    const saved = localStorage.getItem('desktopDrawerOpen');
    return saved !== null ? saved === 'true' : true;
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    const newDesktopOpen = !desktopOpen;
    setDesktopOpen(newDesktopOpen);
    localStorage.setItem('desktopDrawerOpen', String(newDesktopOpen));
  };

  const navItems = [
    { text: '図面検索', icon: <SearchIcon />, path: '/search' },
    { text: '新規登録', icon: <UploadIcon />, path: '/upload' },
    { text: '図面一覧', icon: <ListIcon />, path: '/manage' }
  ];

  const drawer = (
    <div>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 1, color: 'text.secondary' }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          造作図面検索POC
        </Typography>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton 
              selected={location.pathname === item.path || (location.pathname === '/' && item.path === '/search')}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                minHeight: 48,
                justifyContent: desktopOpen ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: desktopOpen ? 2 : 'auto', justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: desktopOpen ? 1 : 0, display: desktopOpen ? 'block' : 'none' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : miniDrawerWidth}px)` },
          ml: { sm: desktopOpen ? `${drawerWidth}px` : `${miniDrawerWidth}px` },
          backgroundColor: '#fff',
          color: '#333',
          boxShadow: 1,
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {navItems.find(item => item.path === location.pathname || (location.pathname === '/' && item.path === '/search'))?.text || '図面詳細'}
          </Typography>
          
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
                {user.username}
              </Typography>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>
                {user.username.charAt(0)}
              </Avatar>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: desktopOpen ? drawerWidth : miniDrawerWidth }, flexShrink: { sm: 0 }, transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        })}}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: desktopOpen ? drawerWidth : miniDrawerWidth,
                overflowX: 'hidden',
                transition: theme => theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
            },
          }}
          open={true}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : miniDrawerWidth}px)` }, height: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
