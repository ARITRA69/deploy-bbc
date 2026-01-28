import { Database } from "bun:sqlite";

/**
 * SQLite database connection using Bun's built-in sqlite module
 * Docs: https://bun.sh/docs/api/sqlite
 *
 * Benefits of bun:sqlite:
 * - Zero dependencies (built into Bun)
 * - Extremely fast (native implementation)
 * - Type-safe prepared statements
 * - Automatic statement caching
 */

const DATABASE_PATH = process.env.DATABASE_PATH || "./data/app.db";

/**
 * Create SQLite database instance
 * Options:
 * - create: true - creates the database file if it doesn't exist
 * - readwrite: allows both reading and writing
 * - strict: enables strict mode for better type safety
 */
export const db = new Database(DATABASE_PATH, {
  create: true,
  readwrite: true,
  strict: true,
});

// Enable Write-Ahead Logging (WAL) mode for better concurrency
db.run("PRAGMA journal_mode = WAL");

// Enable foreign key constraints
db.run("PRAGMA foreign_keys = ON");

/**
 * Test database connection
 */
export function test_connection(): boolean {
  try {
    const result = db.query("SELECT 1 as test").get() as { test: number };
    console.log("✅ SQLite connected successfully");
    return result.test === 1;
  } catch (error) {
    console.error("❌ SQLite connection failed:", error);
    return false;
  }
}

/**
 * Close database connection
 * Call this when shutting down the application
 */
export function close_connection(): void {
  db.close();
  console.log("SQLite connection closed");
}

/**
 * Helper function to run migrations/DDL statements
 */
export function migrate(sql: string): void {
  db.run(sql);
}

// Example usage - uncomment and modify as needed
/*
// Create users table
export function create_users_table() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create index on email
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
}

// Get all users
export function get_all_users() {
  return db.query("SELECT * FROM users").all();
}

// Get user by ID
export function get_user_by_id(id: number) {
  const stmt = db.query("SELECT * FROM users WHERE id = ?");
  return stmt.get(id);
}

// Get user by email
export function get_user_by_email(email: string) {
  const stmt = db.query("SELECT * FROM users WHERE email = ?");
  return stmt.get(email);
}

// Create user
export function create_user(email: string, name: string) {
  const stmt = db.prepare(`
    INSERT INTO users (email, name)
    VALUES (?, ?)
  `);

  const result = stmt.run(email, name);
  return {
    id: result.lastInsertRowid,
    email,
    name,
  };
}

// Update user
export function update_user(id: number, email: string, name: string) {
  const stmt = db.prepare(`
    UPDATE users
    SET email = ?, name = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(email, name, id);
  return get_user_by_id(id);
}

// Delete user
export function delete_user(id: number) {
  const stmt = db.prepare("DELETE FROM users WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}

// Transaction example
export function create_user_with_profile(
  email: string,
  name: string,
  bio: string
) {
  const transaction = db.transaction((email, name, bio) => {
    // Create user
    const userStmt = db.prepare("INSERT INTO users (email, name) VALUES (?, ?)");
    const userResult = userStmt.run(email, name);
    const userId = userResult.lastInsertRowid;

    // Create profile
    const profileStmt = db.prepare("INSERT INTO profiles (user_id, bio) VALUES (?, ?)");
    profileStmt.run(userId, bio);

    return userId;
  });

  return transaction(email, name, bio);
}

// Batch insert example
export function create_users_batch(users: Array<{ email: string; name: string }>) {
  const stmt = db.prepare("INSERT INTO users (email, name) VALUES (?, ?)");

  const insertMany = db.transaction((users) => {
    for (const user of users) {
      stmt.run(user.email, user.name);
    }
  });

  insertMany(users);
}

// Type-safe query example
type User = {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export function get_users_typed(): User[] {
  return db.query<User, []>("SELECT * FROM users").all();
}

export function get_user_by_id_typed(id: number): User | null {
  return db.query<User, [number]>("SELECT * FROM users WHERE id = ?").get(id);
}
*/
