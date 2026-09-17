import type {
  AnalyticsResponse,
  TransactionResponse,
} from "../types/transaction";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface TransactionParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  user_id?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: string;
  maxAmount?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const fetchTransactions = async (
  params: TransactionParams = {}
): Promise<TransactionResponse> => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const response = await fetch(
    `${API_URL}/transactions?${query.toString()}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
};

export const fetchAnalytics = async (): Promise<AnalyticsResponse> => {
  const response = await fetch(`${API_URL}/transactions/analytics`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
};

export const getCsvUrl = (columns: string[]) => {
  const query = new URLSearchParams({
    columns: columns.join(","),
  });

  return `${API_URL}/transactions/export?${query.toString()}`;
};

export const downloadCsv = async (columns: string[]) => {
  const response = await fetch(getCsvUrl(columns), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to export CSV");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "transactions.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
};
