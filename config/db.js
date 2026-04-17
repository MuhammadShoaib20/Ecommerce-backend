import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is set
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('❌ MONGODB_URI environment variable is not set!');
      console.error('💡 Please set MONGODB_URI in your environment variables.');
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
      // Fallback for development only
      console.warn('⚠️  Using localhost fallback (development only)');
      const fallbackURI = 'mongodb://localhost:27017/shophub';
      const conn = await mongoose.connect(fallbackURI);
      console.log(`✅ MongoDB Connected (fallback): ${conn.connection.host}`);
      return;
    }

    // Log partial URI for debugging (hide password)
    const maskedURI = mongoURI.replace(/:(.*)@/, ':****@');
    console.log(`🔌 Connecting to MongoDB: ${maskedURI}`);

    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    console.error('⚠️  Server will continue running but database features will not work.');
    console.error('💡 Please set MONGODB_URI in your .env file or ensure MongoDB is running locally.');
    
    // In production, fail fast if database is essential
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Exiting because database connection failed in production.');
      process.exit(1);
    }
    // In development, keep server running for debugging
  }
};

export default connectDB;