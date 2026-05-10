require('dotenv').config();
const express = require('express');
const connectDB = require('./dbconfig/db');
const viewRoutes = require('./routes/viewRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

connectDB();

app.set('view engine', 'ejs');
app.set('views', './views');

// --- ROUTES ---
// Aligned to /api/v1/ so your tests will pass!
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/posts', require('./routes/postRoutes'));

// The UI View Route
app.use('/home', viewRoutes);
app.get('/', (req,res) => 
    res.redirect('/home'))

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message });
});

// --- SERVER START ---
// Only listen if we are NOT in test mode
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;