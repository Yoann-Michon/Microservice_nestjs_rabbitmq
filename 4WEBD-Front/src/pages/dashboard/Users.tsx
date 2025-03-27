import { useState, useEffect, ChangeEvent } from 'react';
import {
  Typography, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  TableContainer, 
  Paper, 
  CircularProgress, 
  Box, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/User.service';
import { AuthService } from '../../services/Auth.service';
import { IUser } from "../../models/User.interface";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function User() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<IUser>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.isAdmin()) {
      navigate('/');
    } else {
      fetchUsers();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching users");
      setLoading(false);
    }
  };

  const handleEditClick = (user: IUser) => {
    setSelectedUser(user);
    setEditedUser({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role
    });
    setEditDialogOpen(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      await userService.updateUser(selectedUser.id!, editedUser);

      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, ...editedUser } : user
      ));

      setSnackbar({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });

      setEditDialogOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : "Error updating user",
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: IUser) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete || !userToDelete.id) return;

    try {
      setLoading(true);
      await userService.deleteUser(userToDelete.id);

      setUsers(users.filter(user => user.id !== userToDelete.id));

      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });

      setDeleteDialogOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : "Error deleting user",
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ margin: 2 }}>Users</Typography>

        {loading && <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />}
        {error && <Typography variant="body1" color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}

        <TableContainer component={Paper} sx={{ mt: 2, maxHeight: '70vh', overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Firstname</TableCell>
                <TableCell>Lastname</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>No users found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: IUser) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleEditClick(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogContent>
            <TextField
              label="First name"
              name="firstname"
              value={editedUser.firstname || ''}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Last name"
              name="lastname"
              value={editedUser.lastname || ''}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              value={editedUser.email || ''}
              disabled
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={editedUser.role || ''}
                onChange={handleSelectChange}
                label="Role"
              >
                <MenuItem value="ADMIN">ADMIN</MenuItem>
                <MenuItem value="USER">USER</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} variant="contained" color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Are you sure you want to delete {userToDelete?.firstname}?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </>
  );
}
