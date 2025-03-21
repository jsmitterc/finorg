import sqlite3 from 'sqlite3';

// Initialize the SQLite database (you can provide a file path or an in-memory database)
const db = new sqlite3.Database('../finance.db', (err) => {
  if (err) {
    console.error('Error opening SQLite database', err);
  } else {
    console.log('SQLite database connected');
  }
});

// Export the DB connection for use in API routes
export default db;