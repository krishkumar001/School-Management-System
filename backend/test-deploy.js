#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 Render Deployment Test Script');
console.log('================================');

// Check current working directory
console.log('Current working directory:', process.cwd());

// List files in current directory
console.log('\nFiles in current directory:');
try {
  const files = fs.readdirSync('.');
  files.forEach(file => {
    const stats = fs.statSync(file);
    console.log(`- ${file} (${stats.isDirectory() ? 'dir' : 'file'})`);
  });
} catch (error) {
  console.error('Error reading directory:', error.message);
}

// Check if package.json exists
console.log('\nChecking package.json:');
try {
  const packagePath = path.join('.', 'package.json');
  if (fs.existsSync(packagePath)) {
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log('✅ package.json found');
    console.log('Name:', packageContent.name);
    console.log('Scripts:', Object.keys(packageContent.scripts || {}));
  } else {
    console.log('❌ package.json not found');
  }
} catch (error) {
  console.error('Error reading package.json:', error.message);
}

// Check if index.js exists
console.log('\nChecking index.js:');
try {
  const indexPath = path.join('.', 'index.js');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.js found');
  } else {
    console.log('❌ index.js not found');
  }
} catch (error) {
  console.error('Error checking index.js:', error.message);
}

console.log('\n🎯 Test completed'); 