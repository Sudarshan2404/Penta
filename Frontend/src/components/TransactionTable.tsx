import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { Transaction } from "../types/transaction";
import defaultAvatar from "../assets/defaultAvtar.svg";

interface Props {
  transactions: Transaction[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

function SortIcon({
  field,
  sortBy,
  sortOrder,
}: {
  field: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}) {
  if (sortBy !== field) {
    return <ChevronsUpDown size={13} />;
  }

  return sortOrder === "asc" ? (
    <ArrowUp size={13} />
  ) : (
    <ArrowDown size={13} />
  );
}

export default function TransactionTable({
  transactions,
  sortBy,
  sortOrder,
  onSort,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl">
      <div className="grid grid-cols-[1.8fr_1fr_1fr_1fr] items-center rounded-lg bg-[#292c35] px-4 py-3 text-xs text-[#9699a8]">
        <button
          className="flex items-center gap-2 text-left"
          onClick={() => onSort("user_id")}
        >
          Name
          <SortIcon
            field="user_id"
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </button>

        <button
          className="flex items-center gap-2"
          onClick={() => onSort("date")}
        >
          Date
          <SortIcon
            field="date"
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </button>

        <button
          className="flex items-center gap-2"
          onClick={() => onSort("amount")}
        >
          Amount
          <SortIcon
            field="amount"
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </button>

        <button
          className="flex items-center gap-2"
          onClick={() => onSort("status")}
        >
          Status
          <SortIcon
            field="status"
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </button>
      </div>

      <div className="divide-y divide-[#282b33]">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="grid grid-cols-[1.8fr_1fr_1fr_1fr] items-center px-4 py-3.5 text-sm"
          >
            <div className="flex items-center gap-3">
              <img
                src={transaction.avtar || defaultAvatar}
                alt={transaction.user_name ?? "User"}
                className="h-9 w-9 rounded-lg object-cover"
                onError={(event) => { event.currentTarget.src = defaultAvatar; }}
              />

              <div>
                <p className="text-[13px] font-medium text-[#f0f1f4]">
                  {transaction.user_name ?? "Unknown user"}
                </p>
                <p className="text-[10px] text-[#777b85]">
                  {transaction.category}
                </p>
              </div>
            </div>

            <p className="text-[12px] text-[#d3d5dc]">
              {new Date(transaction.date).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>

            <p
              className={`text-[13px] font-semibold ${
                transaction.category === "Revenue"
                  ? "text-[#20d264]"
                  : "text-[#f2bd22]"
              }`}
            >
              {transaction.category === "Revenue" ? "+" : "-"}$
              {transaction.amount.toLocaleString()}
            </p>

            <span
              className={`w-fit rounded-full px-3 py-1 text-[10px] font-medium ${
                transaction.status === "Paid"
                  ? "bg-[#185c38] text-[#35df7b]"
                  : "bg-[#5d4d18] text-[#f2bd22]"
              }`}
            >
              {transaction.status === "Paid"
                ? "Completed"
                : "Pending"}
            </span>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="py-12 text-center text-sm text-[#777b85]">
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
}
