import { user_model } from "../../models/user.model.js";
import type { ApiResponse, ApiError } from "../../types/common/api-response.types.js";
import type { UserResponse } from "../../types/models/user.types.js";

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
 * Get all users
 * GET /users
 */
export async function get_users(): Promise<Response> {
  try {
    const users = await user_model.find_all();
    const formatted_users = users.map(format_user_response);

    const response: ApiResponse<UserResponse[]> = {
      success: true,
      data: formatted_users,
    };

    return Response.json(response);
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      error: "Failed to fetch users",
    };
    return Response.json(errorResponse, { status: 500 });
  }
}
