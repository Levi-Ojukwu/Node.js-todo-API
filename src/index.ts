import express from 'express';
import { connectDB } from './config/database';
// import dotenv from 'dotenv';

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server running on port at http://localhost:${port}`);
});

connectDB().catch((err) => {
    console.log(err)
})
