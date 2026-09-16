import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import { email } from "zod";
import { required } from "zod/mini";

interface UserDocument {
  userId?: string;
  name?: string;
  username: string;
  email: string;
  password?: string;
}

const user = new Schema<UserDocument>(
  {
    userId: String,
    name: String,
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
  },
  { timestamps: true },
);

const User = model<UserDocument>("User", user);
export default User;
