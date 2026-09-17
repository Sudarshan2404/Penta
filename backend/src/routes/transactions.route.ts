import { Router } from "express";
import {
  exportTransactionsCSV,
  getTransactionAnalytics,
  getTransactionById,
  getTransactions,
} from "../controllers/transactions.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();

router.use(isAuthenticated);
router.get("/analytics", getTransactionAnalytics);
router.get("/export", exportTransactionsCSV);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);

export default router;
