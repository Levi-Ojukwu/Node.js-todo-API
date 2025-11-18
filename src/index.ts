import app from './app';
import { connectDB } from './config/database';

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running on port at http://localhost:${port}`);
});

connectDB().catch((err) => {
    console.log(err);
});
