import { useState } from 'react';
import { Paper, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setSnackbar }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Login failed');
                return;
            }

            // Get the role and token from the backend response
            const { role, token } = data;

            // Save the token (if you need it for subsequent requests)
            localStorage.setItem('token', token);

            // Based on the role, navigate to the respective dashboard
            if (role === 'teacher') {
                navigate('/teacher-dashboard');
            } else if (role === 'student') {
                navigate('/student-dashboard');
            } else {
                setError('Invalid role');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: '20px auto' }}>
            <Typography variant="h5" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '20px' }}
                >
                    Login
                </Button>
            </form>
            {error && (
                <Typography color="error" style={{ marginTop: '20px' }}>
                    {error}
                </Typography>
            )}
        </Paper>
    );
};

export default LoginPage;
