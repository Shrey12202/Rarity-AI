require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const path = require('path');
const nftRoutes = require('./src/routes/nftRoutes');
const aiRoutes = require('./src/routes/aiRoutes');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(bodyParser.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', nftRoutes);
app.use('/api', aiRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});