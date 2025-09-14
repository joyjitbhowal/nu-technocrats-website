const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`
🍃 MongoDB Connected Successfully!
📍 Host: ${conn.connection.host}
🏷️  Database: ${conn.connection.name}
⚡ Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Connecting...'}
        `);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        
        // Exit process with failure
        setTimeout(() => {
            process.exit(1);
        }, 2000);
    }
};

// Graceful MongoDB connection close
const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('📴 MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error.message);
    }
};

module.exports = connectDB;
module.exports.closeDB = closeDB;