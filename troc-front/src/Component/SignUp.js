import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import MuiPhoneNumber from "mui-phone-number";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import UserService from '../Service/userService';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

export default function SignUp() {

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
    }, []);

    const [errors, setErrors] = useState({});

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
    };
    
    const onPhoneNumberChanged = (value) => {
        let cleanedValue = value.replace(/[^\d+]/g, '');
        try {
          const phoneNumber = parsePhoneNumber(cleanedValue);
          if (phoneNumber) {
            cleanedValue = phoneNumber.format('E.164');
          }
        } catch (error) {
        }
        setFormData(prevData => ({
          ...prevData,
          phone: cleanedValue
        }));
    };
    
      const validateForm = () => {
        let tempErrors = {};
        Object.keys(formData).forEach(key => {
          if (!formData[key]) {
            tempErrors[key] = "This field is required";
          }
        });
        if (formData.email && !isValidEmail(formData.email)) {
            tempErrors.email = "Invalid email address";
        }
        if(formData.confirmPassword !== formData.password) {
            tempErrors.confirmPassword = "Password mismatch. Please verify that both password fields are identical.";
        }
        if (formData.phone) {
            try {
              const phoneNumber = parsePhoneNumber(formData.phone);
              if (!phoneNumber || !isValidPhoneNumber(formData.phone)) {
                tempErrors.phone = "Invalid phone number. Please check and try again.";
              }
            } catch (error) {
              tempErrors.phone = "Invalid phone number format";
            }
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
      };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (validateForm()) {
          console.log(formData);
          try {
            const data = {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                password: formData.password
            }
            const response = await UserService.register(data);
            setSuccess('User registered successfully!');
            console.log(response.data);
          } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during registration');
            console.error('Registration error:', err);
          } finally {
            setLoading(false); 
          }
        } else {
          console.log("Form has errors");
          setLoading(false);
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
            Sign up
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiPhoneNumber
                    required
                    defaultCountry="mg"
                    onChange={onPhoneNumberChanged}
                    value={formData.phone}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    disableFormatting={true}
                    variant="outlined"
                    label="Phone number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  autoComplete="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirm-password"
                  autoComplete="confirm-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/sign-in" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        </Container>
    )
}