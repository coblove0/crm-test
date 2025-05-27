import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { Container, Typography, Box, useMediaQuery, useTheme, Paper } from '@mui/material';
import RoleSelector from './components/RoleSelector';
import ClientTable from './components/ClientTable';
import store, { RootState } from './store';

const AppContent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const role = useSelector((state: RootState) => state.user.role);

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor={isMobile ? 'background.default' : '#f4f6fa'}
    >
      <Paper
        elevation={isMobile ? 0 : 3}
        sx={{
          width: '100%',
          maxWidth: 700,
          mx: 'auto',
          p: isMobile ? 1 : 4,
          borderRadius: isMobile ? 0 : 3,
          boxSizing: 'border-box',
        }}
      >
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          align="center"
          mb={isMobile ? 2 : 4}
        >
          CRM-система
        </Typography>
        <RoleSelector />
        {role !== 'guest' && <ClientTable />}
      </Paper>
    </Box>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;