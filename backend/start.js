#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function setupAndStart() {
  try {
    console.log('🔧 Setting up database...');
    
    // Push database schema
    console.log('📊 Creating database tables...');
    await execAsync('npx prisma db push');
    console.log('✅ Database tables created');
    
    // Seed database
    console.log('🌱 Seeding database...');
    await execAsync('node src/utils/seedData.js');
    console.log('✅ Database seeded');
    
    // Start server
    console.log('🚀 Starting server...');
    require('./src/server.js');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    
    // If database setup fails, try to start server anyway
    console.log('⚠️  Starting server without database setup...');
    require('./src/server.js');
  }
}

setupAndStart();