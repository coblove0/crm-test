import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addClient, updateClient, deleteClient } from '../store/clientsSlice';
import { RootState } from '../store';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Typography,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClientForm from './ClientForm';
import { Client } from '../types';

const ClientTable: React.FC = () => {
  const clients = useSelector((state: RootState) => state.clients);
  const role = useSelector((state: RootState) => state.user.role);
  const dispatch = useDispatch();

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsCreating(false);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingClient({ id: 0, name: '', email: '', phone: '' });
    setIsCreating(true);
    setDialogOpen(true);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = (values: Omit<Client, 'id'>) => {
    if (isCreating) {
      dispatch(addClient(values));
    } else if (editingClient) {
      dispatch(
        updateClient({
          id: editingClient.id,
          ...values,
        })
      );
    }
    setDialogOpen(false);
    setEditingClient(null);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      dispatch(deleteClient(deleteId));
    }
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  return (
    <>
      <Box mb={2} display="flex" justifyContent={isMobile ? 'center' : 'flex-end'}>
        {role === 'user' || role === 'admin' ? (
          <Button
            variant="contained"
            onClick={handleAdd}
            fullWidth={isMobile}
            sx={isMobile ? { fontSize: 16, py: 1.5 } : {}}
          >
            Добавить клиента
          </Button>
        ) : null}
      </Box>
      <TableContainer component={Paper} sx={isMobile ? { boxShadow: 'none' } : {}}>
        <Table aria-label="table clients" size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell sx={isMobile ? { fontSize: 14, px: 1 } : {}}>Имя</TableCell>
              <TableCell sx={isMobile ? { fontSize: 14, px: 1 } : {}}>Email</TableCell>
              <TableCell sx={isMobile ? { fontSize: 14, px: 1 } : {}}>Телефон</TableCell>
              {role === 'admin' && (
                <TableCell align="right" sx={isMobile ? { fontSize: 14, px: 1 } : {}}>
                  Действия
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={role === 'admin' ? 4 : 3}
                  align="center"
                  sx={{ py: isMobile ? 2 : 5, fontSize: isMobile ? 14 : 16 }}
                >
                  Нет клиентов
                </TableCell>
              </TableRow>
            )}
            {clients.map(client => (
              <TableRow key={client.id}>
                <TableCell sx={isMobile ? { fontSize: 14, px: 1 } : {}}>{client.name}</TableCell>
                <TableCell sx={isMobile ? { fontSize: 14, px: 1 } : {}}>{client.email}</TableCell>
                <TableCell sx={isMobile ? { fontSize: 14, px: 1 } : {}}>{client.phone}</TableCell>
                {role === 'admin' && (
                  <TableCell align="right" sx={isMobile ? { px: 1 } : {}}>
                    <Tooltip title="Редактировать">
                      <IconButton
                        onClick={() => handleEdit(client)}
                        size={isMobile ? 'small' : 'medium'}
                        color="primary"
                      >
                        <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton
                        onClick={() => handleDelete(client.id)}
                        size={isMobile ? 'small' : 'medium'}
                        color="error"
                      >
                        <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={isDialogOpen}
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={isMobile ? { sx: { m: 0, borderRadius: 0 } } : {}}
      >
        <DialogTitle sx={isMobile ? { fontSize: 18, px: 2, py: 1.5 } : {}}>
          {isCreating ? 'Добавить клиента' : 'Редактировать клиента'}
        </DialogTitle>
        <DialogContent sx={isMobile ? { px: 2, py: 1 } : {}}>
          {editingClient && (
            <ClientForm
              initialValues={{
                name: editingClient.name,
                email: editingClient.email,
                phone: editingClient.phone,
              }}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Удалить клиента?</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить клиента?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClientTable;