import React from 'react';
import { Container, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xs" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Attendance System
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please login or register to continue.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/login')} 
        style={{ margin: '10px' }}
      >
        Login
      </Button>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => navigate('/register')} 
        style={{ margin: '10px' }}
      >
        Register
      </Button>
    </Container>
  );
};

export default HomePage;
