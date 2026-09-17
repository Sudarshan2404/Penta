import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.cookie
      ?.split(";")
      .map((cookie) => cookie.trim().split("="))
      .find(([name]) => name === "pact_token")?.[1];

    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "login or register to continue" });
    }

    const SECRET = process.env.JWT_SECRET;
    if (!SECRET) {
      throw Error("Enviorment variable not set");
    }
    const verified = jwt.verify(token, SECRET);
    if (!verified) {
      return res.status(403).json({
        success: false,
        message: "Invalid Token try signing in again to continue",
      });
    }

    const userId = typeof verified === "string" ? verified : verified.sub;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid token payload" });
    }
    res.locals.userId = userId;

    return next();
  } catch (error) {
    console.error("Error in auth middleware ", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
