/**
 * MED-BRAIN Backend Server
 * 
 * Entry point for the Node.js application.
 * Handles server startup, graceful shutdown, and environment configuration.
 */

import 'dotenv/config';
import app from './app.js';
import prisma from './prisma/index.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// SERVER STARTUP
// ============================================

const startServer = async () => {
  try {
    // Verify database connection
    console.log('🔌 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                    MED-BRAIN API SERVER                    ║
╠════════════════════════════════════════════════════════════╣
║  Environment: ${NODE_ENV.padEnd(45)}║
║  Port: ${PORT.toString().padEnd(51)}║
║  API Base: http://localhost:${PORT}/api                       ║
║  Health:   http://localhost:${PORT}/health                   ║
╚════════════════════════════════════════════════════════════╝
      `);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  try {
    // Close database connections
    await prisma.$disconnect();
    console.log('✅ Database connections closed');

    // Exit process
    process.exit(0);

  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// ============================================
// START THE SERVER
// ============================================

startServer();
