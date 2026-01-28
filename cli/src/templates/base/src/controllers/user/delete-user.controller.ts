import type { Context } from "hono";
import { z } from "zod";
import { user_model } from "../../models/user.model.js";
import type { ApiResponse, ApiError } from "../../types/common/api-response.types.js";

/**
 * Validation schema
 */
const user_id_schema = z.string().uuid("Invalid user ID format");

/**
 * Delete user by ID
 * DELETE /users/:id
 */
export async function delete_user(c: Context) {
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

    const deleted = await user_model.delete(id);

    if (!deleted) {
      return c.json<ApiError>(
        {
          success: false,
          error: "User not found",
        },
        404
      );
    }

    return c.json<ApiResponse>({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return c.json<ApiError>(
      {
        success: false,
        error: "Failed to delete user",
      },
      500
    );
  }
}
