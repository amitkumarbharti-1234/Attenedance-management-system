import React, { useState, useEffect, useContext } from 'react';
import { Paper, TextField, Button, Typography } from '@mui/material';
import { UserContext } from '../App';
import { useLocation } from 'react-router-dom';

const VerifyEmailPage = ({ setSnackbar }) => {
  const { apiRequest } = useContext(UserContext);
  const [verificationData, setVerificationData] = useState({ email: '', otp: '' });
  const location = useLocation();

  // Get the email from the URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email') || '';
    setVerificationData((prev) => ({ ...prev, email }));
  }, [location]);

  const handleVerify = async (e) => {
    e.preventDefault();
    // The backend expects { email, verificationCode }
    const payload = {
      email: verificationData.email,
      verificationCode: verificationData.otp
    };

    const response = await apiRequest('post', '/api/auth/verify-email', payload);
    if (response) {
      setSnackbar({
        open: true,
        message: response.message || 'Email verified successfully!',
        severity: 'success'
      });
      window.location.href = '/login';
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Verify Your Email
      </Typography>
      <form onSubmit={handleVerify}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={verificationData.email}
          onChange={(e) => setVerificationData({ ...verificationData, email: e.target.value })}
          disabled
        />
        <TextField
          label="OTP"
          variant="outlined"
          fullWidth
          margin="normal"
          value={verificationData.otp}
          onChange={(e) => setVerificationData({ ...verificationData, otp: e.target.value })}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Verify Email
        </Button>
      </form>
    </Paper>
  );
};

export default VerifyEmailPage;
