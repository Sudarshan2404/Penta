import { Download, X } from "lucide-react";
import { useState } from "react";
import { downloadCsv } from "../services/transactions";

const columns = [
  { key: "id", label: "Transaction ID" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "user_id", label: "User" },
  { key: "user_profile", label: "Profile URL" },
];

export default function CsvModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(
    columns.map((column) => column.key)
  );
  const [loading, setLoading] = useState(false);

  const toggle = (key: string) => {
    setSelected((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  const exportCsv = async () => {
    if (!selected.length) return;

    try {
      setLoading(true);
      await downloadCsv(selected);
      onClose();
    } catch (error) {
      console.error(error);
      alert("CSV export failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#30343e] bg-[#191b21] p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Export transactions
            </h2>
            <p className="mt-1 text-xs text-[#858995]">
              Select the columns you want in your CSV report.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#858995] hover:bg-[#282b34] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          {columns.map((column) => (
            <label
              key={column.key}
              className="flex cursor-pointer items-center justify-between rounded-lg bg-[#22252d] px-4 py-3 hover:bg-[#282b34]"
            >
              <span className="text-sm text-[#d9dbe2]">
                {column.label}
              </span>

              <input
                type="checkbox"
                checked={selected.includes(column.key)}
                onChange={() => toggle(column.key)}
                className="h-4 w-4 accent-[#20d264]"
              />
            </label>
          ))}
        </div>

        <button
          disabled={!selected.length || loading}
          onClick={exportCsv}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#20d264] py-3 text-sm font-semibold text-[#101512] transition hover:bg-[#31e477] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={17} />
          {loading ? "Generating..." : "Export CSV"}
        </button>
      </div>
    </div>
  );
}
