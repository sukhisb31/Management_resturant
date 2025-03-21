import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const MenuCard = styled(motion(Card))`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MenuImage = styled(CardMedia)`
  height: 200px;
  object-fit: cover;
`;

const PriceChip = styled(Chip)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 75, 43, 0.9);
  color: white;
`;

const menuItems = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Pizza',
  },
  {
    id: 2,
    name: 'Pasta Carbonara',
    description: 'Spaghetti with eggs, cheese, pancetta, and black pepper',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Pasta',
  },
  {
    id: 3,
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, parmesan cheese with caesar dressing',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Salads',
  },
  // Add more menu items as needed
];

const categories = ['All', 'Pizza', 'Pasta', 'Salads', 'Desserts', 'Beverages'];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <Box sx={{ pt: 8, pb: 4 }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
            Our Menu
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" paragraph>
            Discover our delicious selection of dishes
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs
              value={selectedCategory}
              onChange={(_, newValue) => setSelectedCategory(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              centered
            >
              {categories.map((category) => (
                <Tab key={category} label={category} value={category} />
              ))}
            </Tabs>
          </Box>

          <Grid container spacing={4}>
            {filteredItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <MenuCard
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <MenuImage
                      component="img"
                      image={item.image}
                      alt={item.name}
                    />
                    <PriceChip label={`$${item.price.toFixed(2)}`} />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </MenuCard>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Menu; 