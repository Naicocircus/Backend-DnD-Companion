require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');


// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
