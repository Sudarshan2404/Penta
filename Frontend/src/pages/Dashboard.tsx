import {
  Bell,
  CalendarDays,
  ChevronDown,
  Download,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";
import OverviewChart from "../components/OverviewChart";
import TransactionTable from "../components/TransactionTable";
import CsvModal from "../components/CsvModal";
import {
  fetchAnalytics,
  fetchTransactions,
  type TransactionParams,
} from "../services/transactions";
import type { AnalyticsResponse, Transaction } from "../types/transaction";
import { useAuth } from "../context/AuthContext";
import defaultAvatar from "../assets/defaultAvtar.svg";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsResponse["data"] | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState("");

  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analyticsError, setAnalyticsError] = useState("");
  const [showCsv, setShowCsv] = useState(false);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const params: TransactionParams = {
        page,
        limit,
        search,
        category,
        status,
        user_id: userId,
        sortBy,
        sortOrder,
      };

      const result = await fetchTransactions(params);

      setTransactions(result.data);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      console.error(err);
      setError("Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      setAnalyticsError("");
      const result = await fetchAnalytics();
      setAnalytics(result.data);
    } catch (err) {
      console.error(err);
      setAnalyticsError("Unable to load dashboard analytics.");
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTransactions();
    }, 250);

    return () => clearTimeout(timer);
  }, [page, search, category, status, userId, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }

    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    setUserId("");
    setPage(1);
  };

  const selectNavigation = (item: string) => {
    setActiveNav(item);
    if (item === "Transactions") {
      document.getElementById("transactions")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#242730] text-white">
      <Sidebar active={activeNav} onChange={selectNavigation} userName={user?.name || user?.username} avatar={user?.avtar} />

      <main className="ml-[210px] min-h-screen bg-[#242730]">
        {/* Top bar */}
        <header className="flex h-[73px] items-center justify-between bg-[#191b21] px-7">
          <h1 className="text-[18px] font-semibold">Dashboard</h1>

          <div className="flex items-center gap-5">
            <div className="flex h-9 w-[198px] items-center rounded-md bg-[#272a33] px-3">
              <input
                placeholder="Search..."
                className="w-full bg-transparent text-xs text-white outline-none placeholder:text-[#777b85]"
              />
              <Search size={15} className="text-[#8b8e98]" />
            </div>

            <button className="relative text-[#92959e]">
              <Bell size={18} />
              <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-[#f2bd22]" />
            </button>

            <img
              src="https://thispersondoesnotexist.com/"
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
        </header>

        <div className="space-y-6 p-6">
          {/* Summary */}
          <section className="grid grid-cols-4 gap-5">
            <SummaryCard
              title="Balance"
              value={analytics?.balance ?? 0}
              type="balance"
            />
            <SummaryCard
              title="Revenue"
              value={analytics?.revenue ?? 0}
              type="revenue"
            />
            <SummaryCard
              title="Expenses"
              value={analytics?.expenses ?? 0}
              type="expense"
            />
            <SummaryCard
              title="Savings"
              value={(analytics?.revenue ?? 0) - (analytics?.expenses ?? 0)}
              type="savings"
            />
          </section>

          {/* Overview */}
          <section className="grid grid-cols-[minmax(0,1fr)_280px] gap-5">
            <div className="rounded-xl bg-[#191b21] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium text-white">Overview</h2>

                <button className="flex items-center gap-2 rounded-md border border-[#363943] px-3 py-2 text-[10px] text-[#a3a6af]">
                  Monthly
                  <ChevronDown size={13} />
                </button>
              </div>

              {analytics ? (
                <OverviewChart trends={analytics.monthlyTrends} />
              ) : (
                <div className="flex h-[270px] items-center justify-center text-sm text-[#777b85]">
                  {analyticsError || "Loading analytics..."}
                </div>
              )}
            </div>

            <div className="rounded-xl bg-[#191b21] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-medium">Recent Transaction</h2>
                <button
                  onClick={() => selectNavigation("Transactions")}
                  className="text-[10px] text-[#20d264]"
                >
                  See all
                </button>
              </div>

              <div className="space-y-1">
                {transactions.slice(0, 3).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-2 border-b border-[#292c34] py-2.5 last:border-0"
                  >
                    <img
                      src={transaction.avtar || defaultAvatar}
                      alt=""
                      className="h-8 w-8 rounded-md object-cover"
                      onError={(event) => { event.currentTarget.src = defaultAvatar; }}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] text-[#777b85]">
                        {transaction.category === "Revenue"
                          ? "Transfer from"
                          : "Transfer to"}
                      </p>
                      <p className="truncate text-[11px] text-white">
                        {transaction.user_name ?? "Unknown user"}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-medium ${
                        transaction.category === "Revenue"
                          ? "text-[#20d264]"
                          : "text-[#f2bd22]"
                      }`}
                    >
                      {transaction.category === "Revenue" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </span>
                  </div>
                ))}

                {!transactions.length && (
                  <p className="py-8 text-center text-xs text-[#777b85]">
                    No recent transactions
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Transactions */}
          <section id="transactions" className="rounded-xl bg-[#191b21] p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-[21px] font-semibold">Transactions</h2>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-9 w-[245px] items-center rounded-lg bg-[#292c35] px-3">
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search for anything..."
                    className="w-full bg-transparent text-xs text-white outline-none placeholder:text-[#777b85]"
                  />
                  <Search size={15} className="text-[#8b8e98]" />
                </div>

                <div className="flex h-9 items-center gap-2 rounded-lg bg-[#292c35] px-3">
                  <CalendarDays size={15} className="text-[#999cad]" />
                  <span className="text-[11px] text-[#999cad]">Date range</span>
                </div>

                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 rounded-lg bg-[#292c35] px-3 text-[11px] text-[#999cad] outline-none"
                >
                  <option value="">Category</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Expense">Expense</option>
                </select>

                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 rounded-lg bg-[#292c35] px-3 text-[11px] text-[#999cad] outline-none"
                >
                  <option value="">Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>

                <button
                  onClick={() => setShowCsv(true)}
                  className="flex h-9 items-center gap-2 rounded-lg bg-[#20d264] px-3 text-[11px] font-semibold text-[#101512]"
                >
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-xs text-red-300">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex h-72 items-center justify-center text-sm text-[#777b85]">
                Loading transactions...
              </div>
            ) : (
              <TransactionTable
                transactions={transactions}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            )}

            {/* Pagination */}
            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs text-[#777b85]">
                Page {page} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg bg-[#292c35] px-4 py-2 text-xs text-[#c7c9d0] disabled:opacity-30"
                >
                  Previous
                </button>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg bg-[#292c35] px-4 py-2 text-xs text-[#c7c9d0] disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="mt-3 text-[10px] text-[#777b85] hover:text-white"
            >
              Clear filters
            </button>
          </section>
        </div>
      </main>

      {showCsv && <CsvModal onClose={() => setShowCsv(false)} />}
    </div>
  );
}
