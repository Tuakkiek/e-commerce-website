// src/config/config.js
export default {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  MONGODB_CONNECTIONSTRING: process.env.MONGODB_CONNECTIONSTRING,
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
