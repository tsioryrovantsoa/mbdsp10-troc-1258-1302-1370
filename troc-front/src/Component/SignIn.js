
import React, { useState } from 'react';
import { Container, Box, Avatar, Typography, Grid, TextField, Button, Alert, Link, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import UserService from '../Service/userService';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
    };

    const validateForm = () => {
        let tempErrors = {};
        Object.keys(formData).forEach(key => {
          if (!formData[key]) {
            tempErrors[key] = "This field is required";
          }
        });

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        if (validateForm()) {
          console.log(formData);
          try {
            const response = await UserService.login(formData);
            console.log(response?.data);
            localStorage.setItem("token", response?.data?.accessToken);
            navigate('/accueil');
          } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials!');
            console.error('Registration error:', err);
          } finally {
            setLoading(false); 
          }
        } else {
          console.log("Form has errors");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/sign-up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        </Container>
    )
}