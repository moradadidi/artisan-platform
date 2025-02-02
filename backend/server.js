import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
 // Load the environment variables from .env file

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import usersRouter from './routes/users.js';
import productRouter from './routes/product.js';

// console.log("Loaded Environment Variables:", process.env.MONGO_URI);  // Debugging

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/login', authRouter);
app.use('/api/register', userRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productRouter);

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;
console.log(`Server running on port ${process.env.PORT}`);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
