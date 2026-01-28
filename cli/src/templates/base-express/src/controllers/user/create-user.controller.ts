import type { Request, Response } from "express";
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
export async function create_user(req: Request, res: Response) {
  try {
    // Validate request body
    const validation = create_user_schema.safeParse(req.body);
    if (!validation.success) {
      const errorResponse: ApiError = {
        success: false,
        error: "Validation failed",
        details: validation.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };
      return res.status(400).json(errorResponse);
    }

    // Check if email already exists
    const existing_user = await user_model.find_by_email(validation.data.email);
    if (existing_user) {
      const errorResponse: ApiError = {
        success: false,
        error: "User with this email already exists",
      };
      return res.status(409).json(errorResponse);
    }

    // Create user
    const user = await user_model.create(validation.data);

    const response: ApiResponse<UserResponse> = {
      success: true,
      data: format_user_response(user),
      message: "User created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      error: "Failed to create user",
    };
    res.status(500).json(errorResponse);
  }
}
