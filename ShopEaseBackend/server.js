const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (EXP 10 Requirement)
app.use(cors());
app.use(express.json());

// Custom Request Logger Middleware (EXP 9 & 10 Requirement)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Helper function to read JSON files
const readData = (fileName) => {
  const filePath = path.join(__dirname, 'data', fileName);
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write JSON files
const writeData = (fileName, data) => {
  const filePath = path.join(__dirname, 'data', fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// ------------------- ROUTES (EXP 9 & EXP 10) ------------------- //

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ShopEase API Server (Experiments 9 & 10)' });
});

// 1. PRODUCTS ENDPOINTS
// GET /api/products
app.get('/api/products', (req, res) => {
  try {
    let products = readData('products.json');
    const { q, category } = req.query;

    if (q) {
      const keyword = q.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(keyword) || 
        p.description.toLowerCase().includes(keyword) ||
        p.category.toLowerCase().includes(keyword)
      );
    }

    if (category) {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products', details: error.message });
  }
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  try {
    const products = readData('products.json');
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// POST /api/products (Create Product)
app.post('/api/products', (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }
    const products = readData('products.json');
    const newProduct = {
      id: Date.now().toString(),
      name,
      category: category || 'General',
      description: description || '',
      price: Number(price),
      originalPrice: Number(price) * 1.3,
      rating: 4.5,
      reviewCount: 1,
      availability: 'In Stock',
      inStock: true,
      stockQuantity: 10,
      image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
    };
    products.push(newProduct);
    writeData('products.json', products);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
});

// 2. CATEGORIES ENDPOINTS
app.get('/api/categories', (req, res) => {
  try {
    const categories = readData('categories.json');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve categories', details: error.message });
  }
});

// 3. PROFILE / CUSTOMER ENDPOINTS
app.get('/api/profile', (req, res) => {
  try {
    const profile = readData('profile.json');
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile', details: error.message });
  }
});

app.put('/api/profile', (req, res) => {
  try {
    const currentProfile = readData('profile.json');
    const updatedProfile = { ...currentProfile, ...req.body };
    writeData('profile.json', updatedProfile);
    res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
});

// 4. BANNERS ENDPOINT
app.get('/api/banners', (req, res) => {
  try {
    const banners = readData('banners.json');
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve banners', details: error.message });
  }
});

// 5. ORDERS ENDPOINTS
app.get('/api/orders', (req, res) => {
  try {
    const orders = readData('orders.json');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders', details: error.message });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { items, totalAmount, paymentMode, deliveryAddress } = req.body;
    const orders = readData('orders.json');
    const newOrder = {
      id: `SE${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      productName: items && items.length > 0 ? items[0].name + (items.length > 1 ? ` (+${items.length - 1} more)` : '') : 'ShopEase Order',
      price: totalAmount || 0,
      status: 'Processing',
      statusColor: '#ffa502',
      image: items && items.length > 0 ? items[0].image : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      paymentMode: paymentMode || 'Cash on Delivery',
      deliveryAddress: deliveryAddress || ''
    };
    orders.unshift(newOrder);
    writeData('orders.json', orders);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

app.delete('/api/orders/:id', (req, res) => {
  try {
    let orders = readData('orders.json');
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const deletedOrder = orders.splice(orderIndex, 1);
    writeData('orders.json', orders);
    res.status(200).json({ message: 'Order deleted successfully', order: deletedOrder[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order', details: error.message });
  }
});

// 6. SIMULATED JWT AUTHENTICATION ENDPOINT (EXP 6 & 10)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Simulated validation
  const simulatedToken = `header.${Buffer.from(JSON.stringify({ email, role: 'customer' })).toString('base64')}.signature`;
  res.status(200).json({
    message: 'Login successful',
    token: simulatedToken,
    user: {
      name: 'Karthi Kesavan',
      email: email,
      phone: '+91 98765 43210'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handling middleware (EXP 9 Requirement)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`  ShopEase Node.js & Express.js Backend Server  `);
  console.log(`  Running on http://localhost:${PORT}             `);
  console.log(`================================================`);
});
