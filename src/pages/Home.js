import React from 'react';
import { Box, Container, Typography, Grid, Button, IconButton, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Facebook, Instagram, Twitter, Phone, Email, LocationOn, ArrowDownward } from '@mui/icons-material';

const HeroSection = styled(Box)`
  height: calc(100vh - 60px);
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  margin-top: 0;
  padding-top: 0;
  position: relative;
`;

const FeatureCard = styled(motion.div)`
  padding: 2rem;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 0;
    background-color: #FF4B2B;
    transition: height 0.5s ease;
  }
  
  &:hover::before {
    height: 100%;
  }
`;

const Footer = styled(motion.footer)`
  background-color: #2B2B2B;
  color: white;
  padding: 4rem 0 2rem;
  margin-top: 4rem;
`;

const FooterSection = styled(Box)`
  margin-bottom: 2rem;
`;

const SocialIcon = styled(motion(IconButton))`
  color: white;
  margin-right: 1rem;
  &:hover {
    color: #FF4B2B;
  }
`;

const ContactInfo = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #ffffff;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`;

const ScrollDownIcon = styled(motion.div)`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HighlightSpan = styled(motion.span)`
  color: #FF4B2B;
  display: inline-block;
  font-weight: bold;
`;

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const letterVariants = {
    initial: { y: 20, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.5
      }
    })
  };

  const welcomeText = "Welcome to Our Restaurant";
  const letters = welcomeText.split("");

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="lg" sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Typography variant="h1" component="h1" gutterBottom sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                  style={{ display: 'inline-block', marginRight: letter === ' ' ? '0.5rem' : '0.1rem' }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </Typography>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Typography variant="h5" gutterBottom>
                Experience the <HighlightSpan initial={{ scale: 1 }} whileHover={{ scale: 1.1 }}>finest dining</HighlightSpan> in town
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                component={Link}
                to="/reservations"
                variant="contained"
                size="large"
                sx={{ 
                  mt: 2,
                  borderRadius: '50px',
                  padding: '12px 50px',
                  minWidth: '280px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 20px rgba(255, 75, 43, 0.3)',
                  whiteSpace: 'nowrap',
                  overflow: 'visible'
                }}
              >
                Make a Reservation
              </Button>
            </motion.div>
          </motion.div>
        </Container>
        
        <ScrollDownIcon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          onClick={scrollToFeatures}
          whileHover={{ y: [0, -5, 0], transition: { repeat: Infinity, duration: 1 } }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>Scroll Down</Typography>
          <ArrowDownward fontSize="small" />
        </ScrollDownIcon>
      </HeroSection>

      <Container sx={{ pt: 8, pb: 8, textAlign: 'center' }} id="features">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Why Choose <HighlightSpan>Us</HighlightSpan>
          </Typography>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              {
                title: 'Fresh Ingredients',
                description: 'We use only the finest and freshest ingredients in all our dishes, sourced from local suppliers and organic farms.',
                delay: 0,
              },
              {
                title: 'Expert Chefs',
                description: 'Our team of experienced chefs create culinary masterpieces every day, combining traditional techniques with innovative ideas.',
                delay: 0.2,
              },
              {
                title: 'Perfect Ambiance',
                description: 'Enjoy your meal in our beautifully designed restaurant with comfortable seating, soft lighting, and attentive service.',
                delay: 0.4,
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div 
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                  transition={{ duration: 0.3 }}
                >
                  <FeatureCard>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#FF4B2B', mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Box 
          sx={{ 
            py: 8, 
            px: 2,
            textAlign: 'center',
            background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1574936145840-28808d77a0b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            color: 'white',
            position: 'relative',
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
              Exceptional Dining Experience
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
              We pride ourselves on providing not just a meal, but a memorable experience. From the moment you step in until you leave, every detail is crafted to delight your senses.
            </Typography>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
            >
              <Button
                component={Link}
                to="/contact"
                variant="outlined"
                size="large"
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  borderRadius: '50px',
                  padding: '10px 30px',
                  '&:hover': {
                    borderColor: '#FF4B2B',
                    backgroundColor: 'rgba(255, 75, 43, 0.1)',
                  }
                }}
              >
                Contact Us
              </Button>
            </motion.div>
          </Container>
        </Box>
      </motion.div>

      <Footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={footerVariants}
      >
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FooterSection>
                <Typography variant="h5" gutterBottom>
                  About Us
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  We are passionate about delivering exceptional dining experiences to our guests.
                  Our commitment to quality, service, and innovation sets us apart.
                </Typography>
              </FooterSection>
            </Grid>

            <Grid item xs={12} md={4}>
              <FooterSection>
                <Typography variant="h5" gutterBottom>
                  Contact Info
                </Typography>
                <ContactInfo>
                  <Phone sx={{ mr: 1 }} />
                  <Typography variant="body2">8847585009</Typography>
                </ContactInfo>
                <ContactInfo>
                  <Email sx={{ mr: 1 }} />
                  <Typography variant="body2">sukhisb31@gmail.com</Typography>
                </ContactInfo>
                <ContactInfo>
                  <LocationOn sx={{ mr: 1 }} />
                  <Typography variant="body2">Sector 20, Chandigarh</Typography>
                </ContactInfo>
              </FooterSection>
            </Grid>

            <Grid item xs={12} md={4}>
              <FooterSection>
                <Typography variant="h5" gutterBottom>
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <SocialIcon
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    component="a"
                    href="https://facebook.com/restaurantpro"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <Facebook />
                  </SocialIcon>
                  <SocialIcon
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                    component="a"
                    href="https://instagram.com/restaurantpro"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <Instagram />
                  </SocialIcon>
                  <SocialIcon
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    component="a"
                    href="https://twitter.com/restaurantpro"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                  >
                    <Twitter />
                  </SocialIcon>
                </Box>
                <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                  Follow us on social media for updates, promotions, and more!
                </Typography>
              </FooterSection>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {/* © {new Date().getFullYear()} Restaurant Pro. All rights reserved. */}
            </Typography>
          </Box>
        </Container>
      </Footer>
    </Box>
  );
};

export default Home; 