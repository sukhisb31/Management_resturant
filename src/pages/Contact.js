import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  Link,
} from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

const ContactForm = styled(motion(Paper))`
  padding: 2rem;
  height: 100%;
`;

const ContactInfo = styled(motion(Paper))`
  padding: 2rem;
  height: 100%;
  background-color: #f5f5f5;
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here we'll later add the API call to the Django backend
    console.log('Form submitted:', formData);
  };

  return (
    <Box sx={{ pt: 8, pb: 4 }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" paragraph>
            Get in touch with us for any questions or feedback
          </Typography>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={7}>
              <ContactForm
                elevation={3}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={4}
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </ContactForm>
            </Grid>

            <Grid item xs={12} md={5}>
              <ContactInfo
                elevation={3}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography variant="h5" gutterBottom>
                  Restaurant Information
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>
                      Sector 20, Chandigarh
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>
                      8847585009
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>
                      sukhisb31@gmail.com
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                  Opening Hours
                </Typography>
                <Typography>Monday - Friday: 11:00 AM - 10:00 PM</Typography>
                <Typography>Saturday - Sunday: 10:00 AM - 11:00 PM</Typography>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Follow Us
                  </Typography>
                  <Box>
                    <IconButton 
                      color="primary" 
                      component={Link} 
                      href="https://facebook.com/restaurantpro"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        mr: 1,
                        '&:hover': { 
                          transform: 'translateY(-2px)', 
                          backgroundColor: 'rgba(255, 75, 43, 0.08)' 
                        },
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <FacebookIcon />
                    </IconButton>
                    <IconButton 
                      color="primary" 
                      component={Link} 
                      href="https://instagram.com/restaurantpro"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        mr: 1,
                        '&:hover': { 
                          transform: 'translateY(-2px)', 
                          backgroundColor: 'rgba(255, 75, 43, 0.08)' 
                        },
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <InstagramIcon />
                    </IconButton>
                    <IconButton 
                      color="primary" 
                      component={Link} 
                      href="https://twitter.com/restaurantpro"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        '&:hover': { 
                          transform: 'translateY(-2px)', 
                          backgroundColor: 'rgba(255, 75, 43, 0.08)' 
                        },
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <TwitterIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Follow us for updates, events, and special offers!
                  </Typography>
                </Box>
              </ContactInfo>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Contact; 