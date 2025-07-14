#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 School Management System - Backend Deployment to Render\n');

console.log('📋 Prerequisites Checklist:');
console.log('1. ✅ MongoDB Atlas account and database');
console.log('2. ✅ GitHub repository with your code');
console.log('3. ✅ Render account (free)\n');

console.log('🔧 Backend Issues Fixed:');
console.log('✅ Removed circular dependency in package.json');
console.log('✅ Fixed password hashing in admin registration');
console.log('✅ Fixed JWT import in parent controller');
console.log('✅ Fixed error handling in all controllers');
console.log('✅ Updated start script for production\n');

console.log('📝 Deployment Steps:\n');

console.log('Step 1: MongoDB Atlas Setup');
console.log('1. Go to https://www.mongodb.com/atlas');
console.log('2. Create a free cluster (M0)');
console.log('3. Create a database user');
console.log('4. Get your connection string');
console.log('5. Add 0.0.0.0/0 to IP whitelist\n');

console.log('Step 2: Render Deployment');
console.log('1. Go to https://dashboard.render.com');
console.log('2. Click "New +" → "Web Service"');
console.log('3. Connect your GitHub repository');
console.log('4. Configure:');
console.log('   - Name: school-management-backend');
console.log('   - Environment: Node');
console.log('   - Build Command: npm install');
console.log('   - Start Command: npm start');
console.log('   - Plan: Free\n');

console.log('Step 3: Environment Variables');
console.log('Add these to Render:');
console.log('MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/school-management');
console.log('NODE_ENV=production');
console.log('PORT=10000');
console.log('JWT_SECRET=your-secret-key-here\n');

console.log('Step 4: Update Frontend');
console.log('Once deployed, update your frontend .env:');
console.log('VITE_BASE_URL=https://your-render-app.onrender.com\n');

console.log('🎯 Quick Commands:');
console.log('• Test locally: npm run dev');
console.log('• Build test: npm start');
console.log('• Check logs: View in Render dashboard\n');

console.log('📊 Features After Deployment:');
console.log('✅ RESTful API endpoints');
console.log('✅ WebSocket support for real-time features');
console.log('✅ JWT authentication');
console.log('✅ Role-based access control');
console.log('✅ MongoDB integration');
console.log('✅ CORS enabled');
console.log('✅ Error handling');
console.log('✅ Security headers\n');

console.log('🔗 Useful Links:');
console.log('• Render Dashboard: https://dashboard.render.com');
console.log('• MongoDB Atlas: https://www.mongodb.com/atlas');
console.log('• Deployment Guide: DEPLOYMENT.md\n');

console.log('🎉 Ready to deploy! Follow the steps above to get your backend live.');

rl.close(); 