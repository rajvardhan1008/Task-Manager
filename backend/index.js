const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require("cookie-parser");

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true,                 
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/task', taskRoutes);
app.use('/user', userRoutes);

mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('MongoDB Connected'))
.catch((error) => console.log(error));

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
