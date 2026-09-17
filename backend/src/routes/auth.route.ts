import { Router } from "express";
import { getUser, signIn, signOut, signUp } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const route = Router();

route.post("/signup", signUp);
route.post("/signin", signIn);
route.post("/signout", isAuthenticated, signOut);
route.get("/me", isAuthenticated, getUser);

export default route;
