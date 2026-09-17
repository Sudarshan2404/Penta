import type { Request, Response } from "express";

export const ping = (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Backend is reachable", timestamp: new Date().toISOString() });
};
