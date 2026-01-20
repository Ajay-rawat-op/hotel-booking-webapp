import mongoose from 'mongoose';
 
const connectDB = async () => {
  console.log('\n=== 🔍 DATABASE CONNECTION DEBUG ===');
  try {
    // Get MongoDB URL from environment variables
    const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;
    console.log('Checking environment variables...');
    console.log('  - MONGO_URL exists:', !!process.env.MONGO_URL);
    console.log('  - MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('  - mongoUrl type:', typeof mongoUrl);
    console.log('  - mongoUrl value:', mongoUrl ? 'SET ✅' : 'NOT SET ❌');
    // Check if MongoDB URL exists
    if (!mongoUrl) {
      console.error('\n❌ CRITICAL ERROR: MONGO_URL is not defined!');
      console.error('Available environment variables:', Object.keys(process.env).slice(0, 10));
      console.error('Environment variables containing "MONGO":', 
        Object.keys(process.env).filter(k => k.includes('MONGO'))
      );
      throw new Error(
        'MongoDB connection string not found. ' +
        'Please set MONGO_URL in your Render environment variables.'
      );
    }
 
    console.log('\n🔗 Attempting MongoDB connection...');
    console.log('Connection string preview:', mongoUrl.substring(0, 25) + '...');
    // Connect to MongoDB
    const conn = await mongoose.connect(mongoUrl);
    console.log('\n✅ MongoDB Connected Successfully!');
    console.log('📊 Database Name:', conn.connection.name);
    console.log('🖥️  Host:', conn.connection.host);
    console.log('🔌 Port:', conn.connection.port);
    console.log('📡 Connection State:', conn.connection.readyState); // 1 = connected
    console.log('===================================\n');
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed!');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    // Provide helpful error messages based on error type
    if (error.message.includes('undefined')) {
      console.error('\n💡 SOLUTION: MONGO_URL is undefined');
      console.error('   → Go to Render Dashboard');
      console.error('   → Select your service');
      console.error('   → Click "Environment" tab');
      console.error('   → Add: Key="MONGO_URL", Value="your-mongodb-connection-string"');
      console.error('   → Click "Save Changes"');
    } else if (error.message.includes('authentication') || error.message.includes('auth')) {
      console.error('\n💡 SOLUTION: Authentication failed');
      console.error('   → Check your MongoDB username and password');
      console.error('   → Verify credentials in MongoDB Atlas → Database Access');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('connect')) {
      console.error('\n💡 SOLUTION: Cannot reach MongoDB server');
      console.error('   → Check MongoDB Atlas Network Access');
      console.error('   → Add IP: 0.0.0.0/0 (Allow from anywhere)');
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 SOLUTION: Connection timeout');
      console.error('   → Check your internet connection');
      console.error('   → Verify MongoDB cluster is running');
    }
    console.error('\n🔴 Full error stack:');
    console.error(error.stack);
    console.error('===================================\n');
    process.exit(1);
  }
};
 
// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});
 
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB');
});
 
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});
 
// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed due to app termination');
  process.exit(0);
});
 
export default connectDB;
