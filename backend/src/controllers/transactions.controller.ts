import type { Request, Response } from "express";
import { Transaction } from "../models/transactions.model.js";
import User from "../models/user.model.js";
import { Parser } from "json2csv";

const addUserNames = async <T extends { user_id: string }>(transactions: T[]) => {
  const userIds = [...new Set(transactions.map((transaction) => transaction.user_id))];
  const users = await User.find({ userId: { $in: userIds } })
    .select("userId name username avtar")
    .lean();
  const profiles = new Map(users.map((user) => [user.userId, { name: user.name || user.username, avtar: user.avtar }]));
  return transactions.map((transaction) => ({ ...transaction, user_name: profiles.get(transaction.user_id)?.name || "Unknown user", avtar: profiles.get(transaction.user_id)?.avtar }));
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      search,
      category,
      status,
      user_id,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = "date",
      sortOrder = "desc",
    } = req.query;

    const currentPage = Number(page);
    const pageLimit = Number(limit);
    const skip = (currentPage - 1) * pageLimit;

    const filter: any = {};

    // Search
    if (search) {
      filter.$or = [
        { user_id: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // User filter
    if (user_id) {
      filter.user_id = user_id;
    }

    // Date filter
    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(startDate as string);
      }

      if (endDate) {
        filter.date.$lte = new Date(endDate as string);
      }
    }

    // Amount filter
    if (minAmount || maxAmount) {
      filter.amount = {};

      if (minAmount) {
        filter.amount.$gte = Number(minAmount);
      }

      if (maxAmount) {
        filter.amount.$lte = Number(maxAmount);
      }
    }

    // Sorting
    const sort: any = {
      [sortBy as string]: sortOrder === "asc" ? 1 : -1,
    };

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort(sort).skip(skip).limit(pageLimit).lean(),

      Transaction.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: await addUserNames(transactions),
      pagination: {
        page: currentPage,
        limit: pageLimit,
        total,
        totalPages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

/**
 * Get single transaction
 */
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      id: Number(id),
    }).lean();

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      data: (await addUserNames([transaction]))[0],
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction",
    });
  }
};

/**
 * Get dashboard analytics
 * - Revenue
 * - Expenses
 * - Category breakdown
 * - Monthly trends
 */
export const getTransactionAnalytics = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find().lean();
    const categories = new Map<string, { _id: string; total: number; count: number }>();
    const trends = new Map<string, { _id: { year: number; month: number; category: string }; total: number }>();

    for (const transaction of transactions) {
      const amount = Number(transaction.amount) || 0;
      const category = transaction.category;
      const categoryTotal = categories.get(category) ?? { _id: category, total: 0, count: 0 };
      categoryTotal.total += amount;
      categoryTotal.count += 1;
      categories.set(category, categoryTotal);

      const date = new Date(transaction.date);
      if (Number.isNaN(date.getTime())) continue;
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1;
      const key = `${year}-${month}-${category}`;
      const trend = trends.get(key) ?? { _id: { year, month, category }, total: 0 };
      trend.total += amount;
      trends.set(key, trend);
    }

    const summary = [...categories.values()];
    const monthlyTrends = [...trends.values()].sort((a, b) => a._id.year - b._id.year || a._id.month - b._id.month);
    const revenue = categories.get("Revenue")?.total ?? 0;
    const expenses = categories.get("Expense")?.total ?? 0;

    res.status(200).json({
      success: true,
      data: {
        revenue,
        expenses,
        balance: revenue - expenses,
        categoryBreakdown: summary,
        monthlyTrends,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

/**
 * Export transactions as CSV
 * User can provide columns through:
 * ?columns=id,date,amount,category,status,user_id
 */
export const exportTransactionsCSV = async (req: Request, res: Response) => {
  try {
    const { columns = "id,date,amount,category,status,user_id" } = req.query;

    const selectedColumns = (columns as string)
      .split(",")
      .map((column) => column.trim());

    const allowedColumns = [
      "id",
      "date",
      "amount",
      "category",
      "status",
      "user_id",
      "user_profile",
    ];

    const invalidColumns = selectedColumns.filter(
      (column) => !allowedColumns.includes(column),
    );

    if (invalidColumns.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid columns: ${invalidColumns.join(", ")}`,
      });
    }

    const transactions = await Transaction.find()
      .select(selectedColumns.join(" "))
      .lean();

    const parser = new Parser({
      fields: selectedColumns,
    });

    const csv = parser.parse(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting CSV:", error);

    res.status(500).json({
      success: false,
      message: "Failed to export transactions",
    });
  }
};
