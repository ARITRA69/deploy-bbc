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
export async function delete_user(id: string): Promise<Response> {
  try {
    // Validate ID format
    const validation = user_id_schema.safeParse(id);
    if (!validation.success) {
      const errorResponse: ApiError = {
        success: false,
        error: "Invalid user ID",
        details: validation.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };
      return Response.json(errorResponse, { status: 400 });
    }

    const deleted = await user_model.delete(id);

    if (!deleted) {
      const errorResponse: ApiError = {
        success: false,
        error: "User not found",
      };
      return Response.json(errorResponse, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      message: "User deleted successfully",
    };

    return Response.json(response);
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      error: "Failed to delete user",
    };
    return Response.json(errorResponse, { status: 500 });
  }
}
