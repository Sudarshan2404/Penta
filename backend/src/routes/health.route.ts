import { Router } from "express";
import { ping } from "../controllers/health.controller.js";

const router = Router();

router.get("/ping", ping);
router.get("/checkbackend", ping);

export default router;
