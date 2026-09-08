import dotenv from 'dotenv';
dotenv.config();

import { app } from './app.js';
import { prisma } from './config/db.js';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function startServer() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ Connected to MySQL database successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 Chowkichiwadi Mandal Server running on http://localhost:${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
