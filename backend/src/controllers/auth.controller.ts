import type { Request, Response } from "express";
import { createToken } from "../services/createToken.service.js";
import User from "../models/user.model.js";
import z from "zod";
import bcrypt from "bcrypt";

const TOKEN_COOKIE = "pact_token";
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

const userSchema = z.object({
  name: z.string(),
  username: z.string().min(4, {
    message: "username should contain atlest 4 letters",
  }),
  password: z
    .string({ message: "Password should be a string" })
    .min(6, { message: "password should contain atlest 4 letters" }),
  email: z.email({ message: "Input a propper email" }),
});

const signInSchema = z
  .object({
    email: z.email().optional(),
    username: z.string().min(4).optional(),
    password: z.string().min(6),
  })
  .refine((data) => data.email || data.username, {
    message: "Email or username is required",
    path: ["email"],
  });

const validationMessage = (error: z.ZodError) => {
  const issue = error.issues[0];
  if (!issue) return "Invalid input";
  const field = issue.path[0];
  return field ? `${String(field)}: ${issue.message}` : issue.message;
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const inputData = userSchema.safeParse(req.body);
    if (!inputData.success) {
      return res.status(400).json({
        success: false,
        message: validationMessage(inputData.error),
        payload: z.treeifyError(inputData.error),
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: inputData.data.email.toLowerCase() },
        { username: inputData.data.username },
      ],
    }).select("email username").lean();

    if (existingUser) {
      const message = existingUser.email === inputData.data.email.toLowerCase()
        ? "An account with this email already exists"
        : "This username is already taken";
      return res.status(409).json({ success: false, message });
    }

    const count = await User.countDocuments();
    const userId = `user_${String(count + 1).padStart(3, "0")}`;

    const hashedPass = await bcrypt.hash(inputData.data.password, 10);

    const user = await User.insertOne({
      userId,
      name: inputData.data.name,
      username: inputData.data.username,
      password: hashedPass,
      email: inputData.data.email.toLowerCase(),
    });

    const token = createToken(user.id);

    return res
      .cookie(TOKEN_COOKIE, token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ success: true, message: "Signed up successfully" });
  } catch (error) {
    console.error("Error while signingUp", error);
    if (typeof error === "object" && error && "code" in error && error.code === 11000) {
      const key = "keyPattern" in error && typeof error.keyPattern === "object" && error.keyPattern
        ? Object.keys(error.keyPattern)[0]
        : "field";
      return res.status(409).json({ success: false, message: `${key === "email" ? "Email" : "Username"} already exists` });
    }
    return res
      .status(500)
      .json({ success: false, message: "An Internal server Error Occured" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const inputData = signInSchema.safeParse(req.body);

    if (!inputData.success) {
      return res.status(400).json({
        success: false,
        message: validationMessage(inputData.error),
        payload: z.treeifyError(inputData.error),
      });
    }

    const { email, username, password } = inputData.data;
    const identifierField = email ? "email" : "username";
    const identifierValue = email ?? username!;
    const user = (await User.findOne()
      .where(identifierField)
      .equals(identifierValue)
      .exec()) as { id: string; password?: string } | null;

    if (
      !user ||
      typeof user.password !== "string" ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = createToken(user.id);

    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Unable to create authentication token",
      });
    }

    return res
      .cookie(TOKEN_COOKIE, token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true, message: "Signed in successfully" });
  } catch (error) {
    console.error("Error while signingIn", error);
    return res
      .status(500)
      .json({ success: false, message: "An Internal server Error Occured" });
  }
};

export const signOut = (_req: Request, res: Response): void => {
  try {
    res
      .clearCookie(TOKEN_COOKIE, cookieOptions)
      .status(200)
      .json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("An error occured while signing out ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUser = async (_req: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.userId).select("-password").lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error getting current user", error);
    return res.status(500).json({ success: false, message: "Unable to retrieve user" });
  }
};
