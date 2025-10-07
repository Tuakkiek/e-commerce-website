// src/config/config.js
const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret', 
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
