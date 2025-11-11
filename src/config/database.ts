import mongoose from "mongoose";

// Connect to database 
export const connectDB = async(): Promise<void> => {
    try {
        // Read the value of the mongoDB URL string
        const mongoURI = process.env['MONGODB_URI'];

        // Check if the mongoDB URL is defined
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in the environmental variable');
        }

        // Connect your application to mongoDB database
        await mongoose.connect(mongoURI)

        // Close your mongoDB connection properly
        process.on('SIGINT', async () => {
            // Cleanly close the mongoDB connection
            await mongoose.connection.close();

            // End the node.js process safely
            process.exit(0);

        }) 
    } catch (error) {
        console.error(`Failed to connect to mongoDB ${error}`);
        throw Error;
    }
}

// Close your database connection
export const disconnectDB = async(): Promise<void> => {
    try {
        await mongoose.connection.close();
    } catch (error) {}
}