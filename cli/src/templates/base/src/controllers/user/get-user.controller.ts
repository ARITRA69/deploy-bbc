import type { Context } from "hono";
import { z } from "zod";
import { user_model } from "../../models/user.model.js";
import type { ApiResponse, ApiError } from "../../types/common/api-response.types.js";
import type { UserResponse } from "../../types/models/user.types.js";

/**
 * Validation schema
 */
const user_id_schema = z.string().uuid("Invalid user ID format");

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
 * Get user by ID
 * GET /users/:id
 */
export async function get_user(c: Context) {
  try {
    const id = c.req.param("id");

    // Validate ID format
    const validation = user_id_schema.safeParse(id);
    if (!validation.success) {
      return c.json<ApiError>(
        {
          success: false,
          error: "Invalid user ID",
          details: validation.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        400
      );
    }

    const user = await user_model.find_by_id(id);

    if (!user) {
      return c.json<ApiError>(
        {
          success: false,
          error: "User not found",
        },
        404
      );
    }

    return c.json<ApiResponse<UserResponse>>({
      success: true,
      data: format_user_response(user),
    });
  } catch (error) {
    return c.json<ApiError>(
      {
        success: false,
        error: "Failed to fetch user",
      },
      500
    );
  }
}
