import type { Request, Response } from "express";
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
export async function get_user(req: Request, res: Response) {
  try {
    const { id } = req.params;

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
      return res.status(400).json(errorResponse);
    }

    const user = await user_model.find_by_id(id);

    if (!user) {
      const errorResponse: ApiError = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(errorResponse);
    }

    const response: ApiResponse<UserResponse> = {
      success: true,
      data: format_user_response(user),
    };

    res.json(response);
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      error: "Failed to fetch user",
    };
    res.status(500).json(errorResponse);
  }
}
