const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Route imports
const userRoutes = require('./User/user');
const groupRoutes = require('./Groups/groups');

// Route setup
app.use('/api', userRoutes);
app.use('/groups', groupRoutes);

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
