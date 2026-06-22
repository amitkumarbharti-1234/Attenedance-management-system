import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Container,
  Button,
  Snackbar,
  Alert,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import axios from 'axios';

// Import Pages
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

// Create Context
export const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // API Request Function
  const apiRequest = async (method, url, data) => {
    try {
      const response = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
          "Content-Type": "application/json"
        },
        body: data ? JSON.stringify(data) : null,
      });
      if (!response.ok) {
        const errorRes = await response.json();
        throw new Error(errorRes.message || "Request failed");
      }
      return response.json();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error occurred', severity: 'error' });
      return null;
    }
  };

  // Load User Data
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await apiRequest('get', '/api/auth/me');
        if (response) {
          if (!response.verified) {
            setSnackbar({ open: true, message: 'Please verify your email before logging in.', severity: 'warning' });
            localStorage.removeItem('token');
            setUser(null);
            navigate('/verify-email');
            return;
          }
          setUser(response);
          if (response.role === 'student') {
            navigate('/student-dashboard');
          } else if (response.role === 'teacher') {
            navigate('/teacher-dashboard');
          }
        } else {
          setUser(false);
        }
      } else {
        setUser(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, apiRequest, activeSession }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center' }}>
          <Typography variant="h6" sx={{ mb: isMobile ? 1 : 0 }}>
            Attendance System
          </Typography>
          {user && (
            <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'flex-start' : 'center'}>
              <Typography variant="body2" sx={{ mr: isMobile ? 0 : 2, mb: isMobile ? 1 : 0 }}>
                Welcome, {user.email} ({user.role})
              </Typography>
              <Button color="inherit" onClick={() => {
                localStorage.removeItem('token');
                setUser(null);
                navigate('/');
              }}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" style={{ marginTop: '20px', textAlign: 'center' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage setSnackbar={setSnackbar} />} />
          <Route path="/register" element={<RegisterPage setSnackbar={setSnackbar} />} />
          <Route path="/verify-email" element={<VerifyEmailPage setSnackbar={setSnackbar} />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Routes>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </UserContext.Provider>
  );
};

export default App; 

 