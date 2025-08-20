const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
};

console.log('🔍 Database Configuration:');
console.log('Host:', dbConfig.host);
console.log('User:', dbConfig.user);
console.log('Database:', dbConfig.database);
console.log('Port:', dbConfig.port);
console.log('SSL Enabled:', !!dbConfig.ssl);
console.log('Environment:', process.env.NODE_ENV);

const pool = mysql.createPool(dbConfig);

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database connection...');

    if (process.env.NODE_ENV === 'production') {
      const connection = await pool.getConnection();
      console.log('✅ Connected to Railway MySQL database successfully');
      
      const [rows] = await connection.execute('SELECT 1 as test');
      console.log('✅ Database query test successful');
      connection.release();
    } else {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      });

      await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      console.log('✅ Local database created/verified');
      await connection.end();
    }

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_location (latitude, longitude)
      )
    `);

    console.log('✅ Schools table created/verified successfully');
    console.log('🎉 Database initialization completed!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    
    // Enhanced error logging
    console.error('Error details:');
    console.error('- Code:', error.code);
    console.error('- Message:', error.message);
    console.error('- SQL State:', error.sqlState);
    
    // Check environment variables
    console.log('\n🔍 Environment Variables Status:');
    console.log('MYSQLHOST:', process.env.MYSQLHOST ? '✅ Set' : '❌ Missing');
    console.log('MYSQLUSER:', process.env.MYSQLUSER ? '✅ Set' : '❌ Missing');
    console.log('MYSQLPASSWORD:', process.env.MYSQLPASSWORD ? '✅ Set' : '❌ Missing');
    console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE ? '✅ Set' : '❌ Missing');
    console.log('MYSQLPORT:', process.env.MYSQLPORT ? '✅ Set' : '❌ Missing');
    console.log('DB_HOST (fallback):', process.env.DB_HOST ? '✅ Set' : '❌ Missing');
    
    throw error;
  }
}

module.exports = {
  pool,
  initializeDatabase
};