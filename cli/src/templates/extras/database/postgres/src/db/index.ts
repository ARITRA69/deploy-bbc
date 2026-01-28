import postgres from "postgres";

/**
 * PostgreSQL database connection using the native postgres driver
 * Docs: https://github.com/porsager/postgres
 */

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

/**
 * Create PostgreSQL connection instance
 * Supports connection pooling and automatic reconnection
 */
export const sql = postgres(DATABASE_URL, {
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 20, // Idle connection timeout in seconds
  connect_timeout: 10, // Connection timeout in seconds
  onnotice: () => {}, // Suppress notices
});

/**
 * Test database connection
 */
export async function test_connection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    console.log("✅ PostgreSQL connected successfully");
    return true;
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error);
    return false;
  }
}

/**
 * Close database connection
 * Call this when shutting down the application
 */
export async function close_connection(): Promise<void> {
  await sql.end({ timeout: 5 });
  console.log("PostgreSQL connection closed");
}

// Example queries - uncomment and modify as needed
/*
// Create users table
export async function create_users_table() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

// Get all users
export async function get_all_users() {
  return await sql`SELECT * FROM users`;
}

// Get user by ID
export async function get_user_by_id(id: number) {
  return await sql`SELECT * FROM users WHERE id = ${id}`;
}

// Create user
export async function create_user(email: string, name: string) {
  return await sql`
    INSERT INTO users (email, name)
    VALUES (${email}, ${name})
    RETURNING *
  `;
}

// Update user
export async function update_user(id: number, email: string, name: string) {
  return await sql`
    UPDATE users
    SET email = ${email}, name = ${name}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
}

// Delete user
export async function delete_user(id: number) {
  return await sql`DELETE FROM users WHERE id = ${id}`;
}
*/
