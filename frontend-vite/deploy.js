#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting deployment process...\n');

// Check if Netlify CLI is installed
try {
  execSync('netlify --version', { stdio: 'ignore' });
  console.log('✅ Netlify CLI is installed');
} catch (error) {
  console.log('❌ Netlify CLI not found. Installing...');
  try {
    execSync('npm install -g netlify-cli', { stdio: 'inherit' });
    console.log('✅ Netlify CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Netlify CLI. Please install it manually:');
    console.error('   npm install -g netlify-cli');
    process.exit(1);
  }
}

// Build the project
console.log('\n📦 Building the project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Check if dist folder exists
if (!fs.existsSync('dist')) {
  console.error('❌ dist folder not found. Build may have failed.');
  process.exit(1);
}

console.log('\n🌐 Deploying to Netlify...');
console.log('📝 Instructions:');
console.log('1. If this is your first time, you will be prompted to login to Netlify');
console.log('2. Choose "Create & configure a new site"');
console.log('3. Choose your team (or create one)');
console.log('4. Choose a site name (or let Netlify generate one)');
console.log('5. Wait for deployment to complete\n');

try {
  execSync('netlify deploy --prod --dir=dist', { stdio: 'inherit' });
  console.log('\n🎉 Deployment completed successfully!');
  console.log('🔗 Your site is now live on Netlify');
} catch (error) {
  console.error('❌ Deployment failed');
  console.log('\n💡 Alternative deployment methods:');
  console.log('1. Manual upload: Drag and drop the "dist" folder to Netlify dashboard');
  console.log('2. Git integration: Connect your GitHub repo to Netlify for automatic deployments');
  process.exit(1);
} 