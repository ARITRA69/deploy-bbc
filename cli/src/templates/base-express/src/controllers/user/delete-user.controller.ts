import type { Request, Response } from "express";
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
export async function delete_user(req: Request, res: Response) {
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

    const deleted = await user_model.delete(id);

    if (!deleted) {
      const errorResponse: ApiError = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(errorResponse);
    }

    const response: ApiResponse = {
      success: true,
      message: "User deleted successfully",
    };

    res.json(response);
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      error: "Failed to delete user",
    };
    res.status(500).json(errorResponse);
  }
}
