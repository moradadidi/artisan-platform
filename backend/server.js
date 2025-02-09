import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';

// Import Routes
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import usersRouter from './routes/users.js';
import productRouter from './routes/product.js';
import uploadRouter from './routes/upload.js'; // Added image upload route

// Load Environment Variables
dotenv.config(); 

const app = express();

// 🛠️ Middleware
app.use(express.json()); // Ensure JSON parsing before routes
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// 🚀 Connect to Database
connectDB()
  .then(() => console.log('✅ Database Connected'))
  .catch((err) => console.error('❌ Database Connection Failed:', err));

// 🛣️ API Routes
app.use('/api/login', authRouter);
app.use('/api/register', userRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productRouter);
app.use('/api/upload', uploadRouter); // Handle file uploads

// 🌍 Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
