import { user_route } from "./user.route.js";

/**
 * Simple router for Bun native server
 * Add your routes here
 */
export async function router(pathname: string, method: string, req: Request): Promise<Response | null> {
  // GET /
  if (pathname === "/" && method === "GET") {
    return Response.json({
      message: "Welcome to your Bun backend!",
      docs: "/docs",
    });
  }

  // User routes
  if (pathname.startsWith("/users")) {
    const response = await user_route(pathname, method, req);
    if (response) {
      return response;
    }
  }

  return null; // No route matched
}
