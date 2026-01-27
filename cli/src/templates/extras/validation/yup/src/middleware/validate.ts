import { Context, Next } from "hono";
import * as yup from "yup";

/**
 * Validation middleware for Hono using Yup schemas
 * Validates request body, query parameters, or route params
 */

export type ValidateTarget = "body" | "query" | "param";

interface ValidationOptions {
  target: ValidateTarget;
  schema: yup.AnySchema;
}

/**
 * Create a validation middleware
 * @param options - Validation configuration
 * @returns Hono middleware function
 */
export function validate(options: ValidationOptions) {
  return async (c: Context, next: Next) => {
    try {
      let data: unknown;

      switch (options.target) {
        case "body":
          data = await c.req.json();
          break;
        case "query":
          data = c.req.query();
          break;
        case "param":
          data = c.req.param();
          break;
        default:
          return c.json(
            { error: "Invalid validation target" },
            400
          );
      }

      // Validate data against schema
      const validated = await options.schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });

      // Store validated data in context for route handlers
      c.set(`validated_${options.target}`, validated);

      await next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return c.json(
          {
            error: "Validation failed",
            details: error.inner.map((err) => ({
              path: err.path || "unknown",
              message: err.message,
            })),
          },
          400
        );
      }

      return c.json(
        { error: "Invalid request data" },
        400
      );
    }
  };
}

/**
 * Helper to get validated data from context
 * @param c - Hono context
 * @param target - Validation target (body/query/param)
 * @returns Validated data
 */
export function get_validated<T>(c: Context, target: ValidateTarget): T {
  return c.get(`validated_${target}`) as T;
}
