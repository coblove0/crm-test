import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
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
  const [selectedRole, setSelectedRole] = useState<Role | ''>(role);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRoleChange = (value: Role) => {
    if (value === 'guest') {
      dispatch(setRole('guest'));
      setSelectedRole('guest');
    } else {
      setSelectedRole(value);
      setLoginOpen(true);
      setLogin('');
      setPassword('');
      setError('');
    }
  };

  const handleLogin = () => {
    // Проверяем логин и пароль
    const user = Object.entries(USERS).find(
      ([name, data]) => name === login && data.password === password && data.role === selectedRole
    );
    if (user) {
      dispatch(setRole(selectedRole as Role));
      setLoginOpen(false);
      setSelectedRole(selectedRole); // обновляем выбранную роль
    } else {
      setError('Неверный логин или пароль');
    }
  };

  const handleDialogClose = () => {
    setLoginOpen(false);
    setSelectedRole(role); // сбрасываем выбранную роль к текущей
  };

  return (
    <>
      <Box
        my={2}
        display="flex"
        alignItems="center"
        gap={isMobile ? 1 : 2}
        flexDirection={isMobile ? 'column' : 'row'}
        width={isMobile ? '100%' : 'auto'}
      >
        <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={isMobile ? { width: '100%' } : {}}>
          Роль:
        </Typography>
        <Select
          value={selectedRole}
          onChange={e => handleRoleChange(e.target.value as Role)}
          size="small"
          fullWidth={isMobile}
          sx={isMobile ? { minWidth: '100%' } : { minWidth: 160 }}
        >
          <MenuItem value="guest">Гость</MenuItem>
          <MenuItem value="user">Пользователь</MenuItem>
          <MenuItem value="admin">Администратор</MenuItem>
        </Select>
      </Box>
      <Dialog open={loginOpen} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>Вход для роли "{selectedRole === 'user' ? 'Пользователь' : 'Администратор'}"</DialogTitle>
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
          <Button onClick={handleDialogClose}>Отмена</Button>
          <Button variant="contained" onClick={handleLogin}>Войти</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoleSelector;