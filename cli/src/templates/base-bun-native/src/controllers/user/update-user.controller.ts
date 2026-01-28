import { z } from "zod";
import { user_model } from "../../models/user.model.js";
import type { ApiResponse, ApiError } from "../../types/common/api-response.types.js";
import type { UserResponse } from "../../types/models/user.types.js";

/**
 * Validation schemas
 */
const user_id_schema = z.string().uuid("Invalid user ID format");
const update_user_schema = z.object({
  email: z.string().email("Invalid email address").optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters").optional(),
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
 * Update user by ID
 * PATCH /users/:id
 */
export async function update_user(id: string, req: Request): Promise<Response> {
  try {
    const body = await req.json();

    // Validate ID format
    const id_validation = user_id_schema.safeParse(id);
    if (!id_validation.success) {
      const errorResponse: ApiError = {
        success: false,
        error: "Invalid user ID",
        details: id_validation.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };
      return Response.json(errorResponse, { status: 400 });
    }

    // Validate request body
    const body_validation = update_user_schema.safeParse(body);
    if (!body_validation.success) {
      const errorResponse: ApiError = {
        success: false,
        error: "Validation failed",
        details: body_validation.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };
      return Response.json(errorResponse, { status: 400 });
    }

    // Check if email is being updated and if it already exists
    if (body_validation.data.email) {
      const existing_user = await user_model.find_by_email(body_validation.data.email);
      if (existing_user && existing_user.id !== id) {
        const errorResponse: ApiError = {
          success: false,
          error: "User with this email already exists",
        };
        return Response.json(errorResponse, { status: 409 });
      }
    }

    // Update user
    const user = await user_model.update(id, body_validation.data);

    if (!user) {
      const errorResponse: ApiError = {
        success: false,
        error: "User not found",
      };
      return Response.json(errorResponse, { status: 404 });
    }

    const response: ApiResponse<UserResponse> = {
      success: true,
      data: format_user_response(user),
      message: "User updated successfully",
    };

    return Response.json(response);
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      error: "Failed to update user",
    };
    return Response.json(errorResponse, { status: 500 });
  }
}
