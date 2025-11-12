import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import todoRoutes from './routes/todoRoutes'
import cors from 'cors';
import morgan from 'morgan';

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Register you routes
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);

export default app;