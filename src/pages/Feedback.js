import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Rating,
  Grid,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Divider,
  Chip,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import PeopleIcon from '@mui/icons-material/People';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: theme.palette.primary.main
  }
}));

const RatingItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: 8,
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
  }
}));

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    visitDate: '',
    visitType: 'dine-in',
    foodQuality: 4,
    serviceQuality: 4,
    ambience: 4,
    cleanliness: 4,
    valueForMoney: 4,
    wouldRecommend: 'yes',
    comments: '',
    visitFrequency: '',
    dish: ''
  });
  
  const [success, setSuccess] = useState(false);
  
  const visitFrequencyOptions = [
    'First time',
    'Rarely (once every few months)',
    'Occasionally (once a month)',
    'Regularly (2-3 times a month)',
    'Frequently (weekly or more)'
  ];
  
  const popularDishes = [
    'Signature Pasta',
    'Grilled Salmon',
    'Margherita Pizza',
    'Beef Burger',
    'Caesar Salad',
    'Chicken Curry',
    'Vegetable Stir Fry',
    'Tiramisu',
    'Cheesecake',
    'Other'
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleRatingChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    
    // In a real application, you would send this data to your backend
    // For now, just show success message and reset form
    setSuccess(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      visitDate: '',
      visitType: 'dine-in',
      foodQuality: 4,
      serviceQuality: 4,
      ambience: 4,
      cleanliness: 4,
      valueForMoney: 4,
      wouldRecommend: 'yes',
      comments: '',
      visitFrequency: '',
      dish: ''
    });
  };
  
  const handleCloseSnackbar = () => {
    setSuccess(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 1,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
        >
          Share Your Experience
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary', maxWidth: '700px', mx: 'auto' }}>
          We value your feedback! Please take a moment to tell us about your recent experience.
          Your insights help us improve our services and create better dining experiences.
        </Typography>
        
        <StyledPaper>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Your Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  helperText="Optional, but helps us follow up"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  helperText="We'll never share your email"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth
                  label="Visit Date"
                  name="visitDate"
                  type="date"
                  value={formData.visitDate}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="visit-frequency-label">How often do you visit us?</InputLabel>
                  <Select
                    labelId="visit-frequency-label"
                    name="visitFrequency"
                    value={formData.visitFrequency}
                    onChange={handleInputChange}
                    label="How often do you visit us?"
                  >
                    {visitFrequencyOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Type of Visit</Typography>
                  <RadioGroup
                    row
                    name="visitType"
                    value={formData.visitType}
                    onChange={handleInputChange}
                  >
                    <FormControlLabel value="dine-in" control={<Radio />} label="Dine-in" />
                    <FormControlLabel value="takeout" control={<Radio />} label="Takeout" />
                    <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="dish-label">What did you order?</InputLabel>
                  <Select
                    labelId="dish-label"
                    name="dish"
                    value={formData.dish}
                    onChange={handleInputChange}
                    label="What did you order?"
                  >
                    {popularDishes.map((dish) => (
                      <MenuItem key={dish} value={dish}>
                        {dish}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Divider>
                  <Chip label="Rate Your Experience" />
                </Divider>
              </Grid>
              
              {/* Ratings */}
              <Grid item xs={12} container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={4} md={2.4}>
                  <RatingItem>
                    <EmojiFoodBeverageIcon color="primary" sx={{ fontSize: '2rem', mb: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>Food Quality</Typography>
                    <Rating
                      name="foodQuality"
                      value={formData.foodQuality}
                      onChange={(event, newValue) => {
                        handleRatingChange('foodQuality', newValue);
                      }}
                      precision={1}
                    />
                  </RatingItem>
                </Grid>
                
                <Grid item xs={12} sm={4} md={2.4}>
                  <RatingItem>
                    <RoomServiceIcon color="primary" sx={{ fontSize: '2rem', mb: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>Service</Typography>
                    <Rating
                      name="serviceQuality"
                      value={formData.serviceQuality}
                      onChange={(event, newValue) => {
                        handleRatingChange('serviceQuality', newValue);
                      }}
                      precision={1}
                    />
                  </RatingItem>
                </Grid>
                
                <Grid item xs={12} sm={4} md={2.4}>
                  <RatingItem>
                    <RestaurantIcon color="primary" sx={{ fontSize: '2rem', mb: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>Ambience</Typography>
                    <Rating
                      name="ambience"
                      value={formData.ambience}
                      onChange={(event, newValue) => {
                        handleRatingChange('ambience', newValue);
                      }}
                      precision={1}
                    />
                  </RatingItem>
                </Grid>
                
                <Grid item xs={12} sm={6} md={2.4}>
                  <RatingItem>
                    <DeliveryDiningIcon color="primary" sx={{ fontSize: '2rem', mb: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>Cleanliness</Typography>
                    <Rating
                      name="cleanliness"
                      value={formData.cleanliness}
                      onChange={(event, newValue) => {
                        handleRatingChange('cleanliness', newValue);
                      }}
                      precision={1}
                    />
                  </RatingItem>
                </Grid>
                
                <Grid item xs={12} sm={6} md={2.4}>
                  <RatingItem>
                    <PeopleIcon color="primary" sx={{ fontSize: '2rem', mb: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>Value for Money</Typography>
                    <Rating
                      name="valueForMoney"
                      value={formData.valueForMoney}
                      onChange={(event, newValue) => {
                        handleRatingChange('valueForMoney', newValue);
                      }}
                      precision={1}
                    />
                  </RatingItem>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Would you recommend us to others?</Typography>
                  <RadioGroup
                    row
                    name="wouldRecommend"
                    value={formData.wouldRecommend}
                    onChange={handleInputChange}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes, definitely" />
                    <FormControlLabel value="maybe" control={<Radio />} label="Maybe" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Please share your thoughts, suggestions or concerns..."
                />
              </Grid>
              
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{ 
                      mt: 2, 
                      px: 4,
                      py: 1.2,
                      borderRadius: '8px',
                      background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF4B2B 50%, #FF8E53 100%)',
                        boxShadow: '0 8px 16px rgba(255, 75, 43, 0.3)',
                      }
                    }}
                  >
                    Submit Feedback
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Thank you for taking the time to provide feedback. Your opinion matters to us!
          </Typography>
        </Box>
      </motion.div>
      
      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Thank you! Your feedback has been submitted successfully.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Feedback; 