import React, { useState, useContext } from 'react';
import { Paper, TextField, Button, Typography, MenuItem } from '@mui/material';
import { UserContext } from '../App';

const RegisterPage = ({ setSnackbar }) => {
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [isRegistered, setIsRegistered] = useState(false);
  const { apiRequest } = useContext(UserContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      setSnackbar({
        open: true,
        message: 'Registration successful! Please verify your email.',
        severity: 'success'
      });
      // Do not redirect automatically. Instead, show the Verify Email button.
      setIsRegistered(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Registration failed',
        severity: 'error'
      });
    }
  };
  const handleGoToVerify = () => {
    // Redirect to verify-email route with email query parameter.
    window.location.href = `/verify-email?email=${encodeURIComponent(registerData.email)}`;
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '500px', margin: '20px auto' }}>
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleRegister}>
        <TextField label="Name" variant="outlined" fullWidth margin="normal"
          value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} />
        <TextField label="Email" type="email" variant="outlined" fullWidth margin="normal"
          value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />
        <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal"
          value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
        <TextField select label="Role" variant="outlined" fullWidth margin="normal"
          value={registerData.role} onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}>
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="teacher">Teacher</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Register
        </Button>
      </form>
      {isRegistered && (
        <Button
          variant="outlined"
          color="secondary"
          style={{ marginTop: '20px' }}
          onClick={handleGoToVerify}
        >
          Verify Email
        </Button>
      )}
    </Paper>
  );
};

export default RegisterPage;
