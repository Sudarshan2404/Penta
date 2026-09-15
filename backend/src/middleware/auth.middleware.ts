import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies("pact_token");

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
      res.status(403).json({
        success: false,
        message: "Invalid Token try signing in again to continue",
      });
    }

    next();
  } catch (error) {
    console.error("Error in auth middleware ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
