export type Category = "Revenue" | "Expense";
export type Status = "Paid" | "Pending";

export interface Transaction {
  _id?: string;
  id: number;
  date: string;
  amount: number;
  category: Category;
  status: Status;
  user_id: string;
  user_name?: string;
  avtar?: string;
  user_profile: string;
}

export interface TransactionResponse {
  success: boolean;
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AnalyticsResponse {
  success: boolean;
  data: {
    revenue: number;
    expenses: number;
    balance: number;
    categoryBreakdown: {
      _id: Category;
      total: number;
      count: number;
    }[];
    monthlyTrends: {
      _id: {
        year: number;
        month: number;
        category: Category;
      };
      total: number;
    }[];
  };
}
