import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import { LogEntry } from '../types';
import { logEntryInputSchema, LogEntryInput } from '../schema/logSchema';

const LOCAL_STORAGE_KEY = 'logEntryUserName';

const Home: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    description: '',
    date: '',
    location: '',
  });

  const { data: logs = [], isLoading } = useQuery<LogEntry[]>('logs', async () => {
    const res = await api.get('/logs');
    return res.data;
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LogEntryInput, string>>>({});

  const createMutation = useMutation(
    (newLog: Omit<LogEntry, 'id'>) => api.post('/logs', newLog),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('logs');
        localStorage.setItem(LOCAL_STORAGE_KEY, formData.userName);
        setFormData({ ...formData, description: '', date: '', location: '' });
        setOpen(false);
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => api.delete(`/logs/${id}`),
    {
      onSuccess: () => queryClient.invalidateQueries('logs'),
    }
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<LogEntryInput & { id: string } | null>(null);
  const [editErrors, setEditErrors] = useState<Partial<Record<keyof LogEntryInput, string>>>({});

  const updateMutation = useMutation(
    (log: LogEntry) => api.put(`/logs/${log.id}`, log),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('logs');
      },
    }
  );  

  useEffect(() => {
    const savedName = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedName) {
      setFormData(prev => ({ ...prev, userName: savedName }));
    }
  }, []);

  const handleDialogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInlineEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editData) {
      setEditData({ ...editData, [name]: value });
    }
  };

  const handleSaveEdit = () => {
    if (!editData) return;
  
    const result = logEntryInputSchema.safeParse(editData);
  
    if (!result.success) {
      const errors: Partial<Record<keyof LogEntryInput, string>> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof LogEntryInput;
        errors[field] = err.message;
      });
      setEditErrors(errors);
      return;
    }

    updateMutation.mutate(editData);
    setEditingId(null);
    setEditData(null);
    setEditErrors({});
  };
    
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
    setEditErrors({});
  };

  const handleSubmit = () => {
    const result = logEntryInputSchema.safeParse(formData);

    if (!result.success) {
      const errors: Partial<Record<keyof LogEntryInput, string>> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof LogEntryInput;
        errors[field] = err.message;
      });
      setFormErrors(errors);
      return;
    }
  
    createMutation.mutate(result.data); // only valid data sent
  };
  
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Event Log Manager</Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          New Log Entry
        </Button>
      </Box>

      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : logs.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No log entries found. Add your first one!
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => {
              const isEditing = editingId === log.id;
              return (
                <TableRow key={log.id}>
                  {isEditing ? (
                    <>
                      <TableCell>
                        <TextField
                          name="userName"
                          value={editData?.userName || ''}
                          onChange={handleInlineEditChange}
                          size="small"
                          error={!!editErrors.userName}
                          helperText={editErrors.userName}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="description"
                          value={editData?.description || ''}
                          onChange={handleInlineEditChange}
                          size="small"
                          error={!!editErrors.description}
                          helperText={editErrors.description}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="date"
                          type="datetime-local"
                          value={editData?.date || ''}
                          onChange={handleInlineEditChange}
                          size="small"
                          error={!!editErrors.date}
                          helperText={editErrors.date}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="location"
                          value={editData?.location || ''}
                          onChange={handleInlineEditChange}
                          size="small"
                          error={!!editErrors.location}
                          helperText={editErrors.location}
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="small" onClick={handleSaveEdit}>Save</Button>
                        <Button size="small" onClick={handleCancelEdit}>Cancel</Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{log.userName}</TableCell>
                      <TableCell>{log.description}</TableCell>
                      <TableCell>{new Date(log.date).toLocaleString()}</TableCell>
                      <TableCell>{log.location}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => {
                            setEditingId(log.id);
                            setEditData(log);
                          }}
                        >Edit</Button>
                        <Button
                          size="small"
                          color="secondary"
                          onClick={() => deleteMutation.mutate(log.id)}
                        >Delete</Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Create Log Entry</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="User Name"
            name="userName"
            value={formData.userName}
            onChange={handleDialogChange}
            error={!!formErrors.userName}
            helperText={formErrors.userName}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleDialogChange}
            error={!!formErrors.description}
            helperText={formErrors.description}
          />
          <TextField
            label="Date"
            name="date"
            type="datetime-local"
            value={formData.date}
            onChange={handleDialogChange}
            error={!!formErrors.date}
            helperText={formErrors.date}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleDialogChange}
            error={!!formErrors.location}
            helperText={formErrors.location}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;
