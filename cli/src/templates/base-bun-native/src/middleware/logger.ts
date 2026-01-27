/**
 * Simple logger middleware for Bun native server
 */
export function logger(req: Request, res: Response, duration: number): void {
  console.log(`${req.method} ${new URL(req.url).pathname} - ${res.status} (${duration}ms)`);
}
