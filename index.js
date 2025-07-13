// Redirect to backend
const path = require('path');
const backendPath = path.join(__dirname, 'backend', 'index.js');
require(backendPath); 