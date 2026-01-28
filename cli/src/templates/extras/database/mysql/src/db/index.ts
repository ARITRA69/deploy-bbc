import mysql from "mysql2/promise";

/**
 * MySQL database connection using mysql2 (optimized for Bun)
 * Docs: https://github.com/sidorares/node-mysql2
 * Note: mysql2 works natively with Bun and provides excellent performance
 */

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

/**
 * Create MySQL connection pool
 * Supports automatic reconnection and connection reuse
 */
export const pool = mysql.createPool({
  uri: DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10, // Maximum number of connections
  queueLimit: 0, // Unlimited queueing
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

/**
 * Get a connection from the pool for executing queries
 * Use this for single queries or simple operations
 */
export async function query(sql: string, params?: any[]) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/**
 * Test database connection
 */
export async function test_connection(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    console.log("✅ MySQL connected successfully");
    return true;
  } catch (error) {
    console.error("❌ MySQL connection failed:", error);
    return false;
  }
}

/**
 * Close database connection pool
 * Call this when shutting down the application
 */
export async function close_connection(): Promise<void> {
  await pool.end();
  console.log("MySQL connection pool closed");
}

// Example queries - uncomment and modify as needed
/*
// Create users table
export async function create_users_table() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

// Get all users
export async function get_all_users() {
  return await query("SELECT * FROM users");
}

// Get user by ID
export async function get_user_by_id(id: number) {
  return await query("SELECT * FROM users WHERE id = ?", [id]);
}

// Create user
export async function create_user(email: string, name: string) {
  const result = await query(
    "INSERT INTO users (email, name) VALUES (?, ?)",
    [email, name]
  );
  return result;
}

// Update user
export async function update_user(id: number, email: string, name: string) {
  return await query(
    "UPDATE users SET email = ?, name = ? WHERE id = ?",
    [email, name, id]
  );
}

// Delete user
export async function delete_user(id: number) {
  return await query("DELETE FROM users WHERE id = ?", [id]);
}
*/
