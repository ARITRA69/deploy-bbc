/**
 * Simple router for Bun native server
 * Add your routes here
 */
export function router(pathname: string, method: string): Response | null {
  // GET /
  if (pathname === "/" && method === "GET") {
    return Response.json({
      message: "Welcome to your Bun backend!",
      docs: "/docs",
    });
  }

  // Add more routes here
  // Example:
  // if (pathname === "/users" && method === "GET") {
  //   return Response.json({ users: [] });
  // }

  return null; // No route matched
}
