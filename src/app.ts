import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import todoRoutes from './routes/todoRoutes'


dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Register you routes
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);

export default app;