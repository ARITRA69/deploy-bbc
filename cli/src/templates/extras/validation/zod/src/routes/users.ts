import { Hono } from "hono";
import { z } from "zod";
import { validate, get_validated } from "../middleware/validate.js";

const users = new Hono();

/**
 * Zod Schemas for validation
 */

// Schema for creating a new user
const create_user_schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  age: z.number().int().min(18, "Must be at least 18 years old").optional(),
});

// Schema for updating a user
const update_user_schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  age: z.number().int().min(18).optional(),
});

// Schema for query parameters
const list_users_query_schema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(),
});

// Schema for route params
const user_id_param_schema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

/**
 * Routes with validation
 */

// GET /users - List users with query validation
users.get(
  "/",
  validate({ target: "query", schema: list_users_query_schema }),
  (c) => {
    const query = get_validated<z.infer<typeof list_users_query_schema>>(c, "query");

    return c.json({
      users: [],
      pagination: {
        page: query.page || 1,
        limit: query.limit || 10,
        search: query.search,
      },
    });
  }
);

// POST /users - Create user with body validation
users.post(
  "/",
  validate({ target: "body", schema: create_user_schema }),
  (c) => {
    const body = get_validated<z.infer<typeof create_user_schema>>(c, "body");

    // Your database logic here
    const new_user = {
      id: crypto.randomUUID(),
      ...body,
      created_at: new Date().toISOString(),
    };

    return c.json(new_user, 201);
  }
);

// GET /users/:id - Get user by ID with param validation
users.get(
  "/:id",
  validate({ target: "param", schema: user_id_param_schema }),
  (c) => {
    const params = get_validated<z.infer<typeof user_id_param_schema>>(c, "param");

    // Your database logic here
    const user = {
      id: params.id,
      name: "John Doe",
      email: "john@example.com",
    };

    return c.json(user);
  }
);

// PATCH /users/:id - Update user with param + body validation
users.patch(
  "/:id",
  validate({ target: "param", schema: user_id_param_schema }),
  validate({ target: "body", schema: update_user_schema }),
  (c) => {
    const params = get_validated<z.infer<typeof user_id_param_schema>>(c, "param");
    const body = get_validated<z.infer<typeof update_user_schema>>(c, "body");

    // Your database logic here
    const updated_user = {
      id: params.id,
      ...body,
      updated_at: new Date().toISOString(),
    };

    return c.json(updated_user);
  }
);

// DELETE /users/:id
users.delete(
  "/:id",
  validate({ target: "param", schema: user_id_param_schema }),
  (c) => {
    const params = get_validated<z.infer<typeof user_id_param_schema>>(c, "param");

    return c.json({
      message: `User ${params.id} deleted successfully`,
    });
  }
);

export default users;
