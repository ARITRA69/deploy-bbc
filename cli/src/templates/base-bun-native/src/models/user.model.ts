import type { User, CreateUserInput, UpdateUserInput } from "../types/models/user.types.js";

/**
 * User model
 *
 * This is a simple in-memory implementation.
 * Replace with your database ORM (Drizzle, Prisma, etc.) in production.
 */

// In-memory storage (for demonstration)
const users: User[] = [];

export const user_model = {
  /**
   * Find all users
   */
  find_all: async (): Promise<User[]> => {
    return users;
  },

  /**
   * Find user by ID
   */
  find_by_id: async (id: string): Promise<User | undefined> => {
    return users.find((user) => user.id === id);
  },

  /**
   * Find user by email
   */
  find_by_email: async (email: string): Promise<User | undefined> => {
    return users.find((user) => user.email === email);
  },

  /**
   * Create a new user
   */
  create: async (input: CreateUserInput): Promise<User> => {
    const user: User = {
      id: crypto.randomUUID(),
      email: input.email,
      name: input.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(user);
    return user;
  },

  /**
   * Update user by ID
   */
  update: async (id: string, input: UpdateUserInput): Promise<User | undefined> => {
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      return undefined;
    }

    users[index] = {
      ...users[index],
      ...input,
      updatedAt: new Date(),
    };

    return users[index];
  },

  /**
   * Delete user by ID
   */
  delete: async (id: string): Promise<boolean> => {
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      return false;
    }

    users.splice(index, 1);
    return true;
  },
};
