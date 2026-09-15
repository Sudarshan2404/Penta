import jwt from "jsonwebtoken";

export const createToken = (userId: string) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw Error("Cannot create a jwt token without  defining a jwt secret");
    }
    const token = jwt.sign(userId, secret);
    return token;

    return;
  } catch (error) {
    console.error("in jwt.service.ts", error);
  }
};
