import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import bookingRoutes from './routes/bookingRoutes.js';
import cors from 'cors';
 
// Load environment variables
dotenv.config();
 
console.log('=== 🔍 ENVIRONMENT DEBUG ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGO_URL exists:', !!process.env.MONGO_URL);
console.log('MONGO_URL type:', typeof process.env.MONGO_URL);
console.log('MONGO_URL preview:', process.env.MONGO_URL ? process.env.MONGO_URL.substring(0, 20) + '...' : 'NOT SET');
console.log('All MONGO env vars:', Object.keys(process.env).filter(k => k.includes('MONGO')));
console.log('Total env vars loaded:', Object.keys(process.env).length);
console.log('==========================\n');
 
const app = express();
const PORT = process.env.PORT || 3001;
 
console.log('🚀 Starting Express server...');
 
// Connect to MongoDB
console.log('📡 Initiating database connection...');
connectDB();
 
// Middleware
console.log('⚙️  Setting up middleware...');
app.use(cors());
app.use(express.json());
 
// Routes
console.log('🛣️  Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/bookings', bookingRoutes);
console.log('   ✅ /api/auth');
console.log('   ✅ /api/contact');
console.log('   ✅ /api/bookings');
 
// Root route
app.get('/', (req, res) => {
  console.log('📥 Root endpoint accessed');
  res.send('✅ Backend is working!');
});
 
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});
 
// Start server
app.listen(PORT, () => {
  console.log('\n================================');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('================================\n');
});
