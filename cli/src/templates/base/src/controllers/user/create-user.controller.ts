import type { Context } from "hono";
import { z } from "zod";
import { user_model } from "../../models/user.model.js";
import type { ApiResponse, ApiError } from "../../types/common/api-response.types.js";
import type { UserResponse } from "../../types/models/user.types.js";

/**
 * Validation schema
 */
const create_user_schema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
});

/**
 * Helper to format user response
 */
function format_user_response(user: any): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

/**
 * Create a new user
 * POST /users
 */
export async function create_user(c: Context) {
  try {
    const body = await c.req.json();

    // Validate request body
    const validation = create_user_schema.safeParse(body);
    if (!validation.success) {
      return c.json<ApiError>(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        400
      );
    }

    // Check if email already exists
    const existing_user = await user_model.find_by_email(validation.data.email);
    if (existing_user) {
      return c.json<ApiError>(
        {
          success: false,
          error: "User with this email already exists",
        },
        409
      );
    }

    // Create user
    const user = await user_model.create(validation.data);

    return c.json<ApiResponse<UserResponse>>(
      {
        success: true,
        data: format_user_response(user),
        message: "User created successfully",
      },
      201
    );
  } catch (error) {
    return c.json<ApiError>(
      {
        success: false,
        error: "Failed to create user",
      },
      500
    );
  }
}
