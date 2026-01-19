import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI is not defined in environment - skipping DB connection');
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      // recommended options (Mongoose 6+ has sensible defaults)
      // keep these explicit for clarity
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    // In production you might exit the process here:
    // process.exit(1);
  }
};

export default connectDB;
