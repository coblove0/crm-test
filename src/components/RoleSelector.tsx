import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { RootState } from '../store';
import { setRole } from '../store/userSlice';
import { Role } from '../types';

// Заглушки для пользователей
const USERS: Record<string, { password: string; role: Role }> = {
  user1: { password: 'userpass', role: 'user' },
  admin1: { password: 'adminpass', role: 'admin' },
};

const RoleSelector: React.FC = () => {
  const dispatch = useDispatch();
  const role = useSelector((state: RootState) => state.user.role);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loginOpen, setLoginOpen] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginOpen = () => {
    setLoginOpen(true);
    setLogin('');
    setPassword('');
    setError('');
  };

  const handleLogin = () => {
    const user = Object.entries(USERS).find(
      ([name, data]) => name === login && data.password === password
    );
    if (user) {
      dispatch(setRole(user[1].role));
      setLoginOpen(false);
    } else {
      setError('Неверный логин или пароль');
    }
  };

  const handleLogout = () => {
    dispatch(setRole('guest'));
  };

  return (
    <Box
      my={2}
      display="flex"
      alignItems="center"
      justifyContent={isMobile ? 'center' : 'flex-end'}
      width="100%"
      gap={2}
    >
      {role === 'guest' ? (
        <Button variant="contained" onClick={handleLoginOpen}>
          Войти
        </Button>
      ) : (
        <>
          <Typography>
            Вы вошли в систему
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Выйти
          </Button>
        </>
      )}
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Вход</DialogTitle>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              label="Логин"
              value={login}
              onChange={e => setLogin(e.target.value)}
              fullWidth
              margin="dense"
              autoFocus
            />
            <TextField
              label="Пароль"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLoginOpen(false)}>Отмена</Button>
            <Button variant="contained" type="submit">
              Войти
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default RoleSelector;