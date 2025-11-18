import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import todoRoutes from './routes/todoRoutes'
import path from "path";


dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// app.use("/uploads", express.static(path.resolve("uploads")));


// Register you routes
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);

export default app;