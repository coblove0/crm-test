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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsCreating(false);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить клиента?')) {
      dispatch(deleteClient(id));
    }
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

  return (
    <>
      <Box mb={2} display="flex" justifyContent={isMobile ? 'center' : 'flex-end'}>
        {(role === 'user' || role === 'admin') && (
          <Button
            variant="contained"
            onClick={handleAdd}
            fullWidth={isMobile}
            sx={isMobile ? { fontSize: 16, py: 1.5 } : {}}
          >
            Добавить клиента
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={isMobile ? { boxShadow: 'none' } : {}}>
        <Table aria-label="table clients" size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell sx={isMobile ? { fontSize: 14, px: 1 } : {}}>Имя</TableCell>
              <TableCell sx={isMobile ? { fontSize: 14, px: 1 } : {}}>Email</TableCell>
              <TableCell sx={isMobile ? { fontSize: 14, px: 1 } : {}}>Телефон</TableCell>
              {(role === 'user' || role === 'admin') && (
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
                  colSpan={role === 'guest' ? 3 : 4}
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
                {(role === 'user' || role === 'admin') && (
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
                    {role === 'admin' && (
                      <Tooltip title="Удалить">
                        <IconButton
                          onClick={() => handleDelete(client.id)}
                          size={isMobile ? 'small' : 'medium'}
                          color="error"
                        >
                          <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>
                    )}
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
    </>
  );
};

export default ClientTable;