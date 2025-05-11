// server/index.js
const express = require("express");
const cors = require("cors");
const dotenv=require("dotenv")
const authRoutes = require ('./routes/authRoutes.js');
const connectDB = require('./config/db.js'); // Import the DB connection function
const uploadRoutes = require('./routes/upload');

dotenv.config();
const app = express();
connectDB(); // Call the function to connect to MongoDB
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);


app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
