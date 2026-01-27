/**
 * Error handler for Bun native server
 */
export function errorHandler(error: unknown, req: Request): Response {
  console.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, error);

  const status = error instanceof Error && "status" in error
    ? (error as Error & { status: number }).status
    : 500;

  const message = error instanceof Error ? error.message : "Internal Server Error";

  return Response.json(
    {
      error: message,
      status,
    },
    { status }
  );
}
