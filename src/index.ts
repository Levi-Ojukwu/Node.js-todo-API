import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port at http://localhost:${PORT}`);
});

connectDB().catch((err) => {
    console.log(err);
});
