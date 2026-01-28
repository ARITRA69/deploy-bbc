import { get_users } from "../controllers/user/get-users.controller.js";
import { get_user } from "../controllers/user/get-user.controller.js";
import { create_user } from "../controllers/user/create-user.controller.js";
import { update_user } from "../controllers/user/update-user.controller.js";
import { delete_user } from "../controllers/user/delete-user.controller.js";

/**
 * Helper to extract ID from path
 */
function extract_id_from_path(pathname: string): string | null {
  const match = pathname.match(/^\/users\/([^/]+)$/);
  return match ? match[1] : null;
}

/**
 * User route handler
 * Handles all /users routes
 */
export async function user_route(pathname: string, method: string, req: Request): Promise<Response | null> {
  // GET /users
  if (pathname === "/users" && method === "GET") {
    return await get_users();
  }

  // POST /users
  if (pathname === "/users" && method === "POST") {
    return await create_user(req);
  }

  // Routes with ID parameter
  const id = extract_id_from_path(pathname);
  if (id) {
    // GET /users/:id
    if (method === "GET") {
      return await get_user(id);
    }

    // PATCH /users/:id
    if (method === "PATCH") {
      return await update_user(id, req);
    }

    // DELETE /users/:id
    if (method === "DELETE") {
      return await delete_user(id);
    }
  }

  return null;
}
