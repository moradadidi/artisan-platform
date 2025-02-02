import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in .env file");
    process.exit(1);
}

console.log("MONGO_URI:", process.env.MONGO_URI); // Debugging: Check if MONGO_URI is loaded
// console.log("Process Env: ", process.env);


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { // Use environment variable here
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
