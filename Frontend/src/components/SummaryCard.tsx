import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  PiggyBank,
} from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  type: "balance" | "revenue" | "expense" | "savings";
}

export default function SummaryCard({
  title,
  value,
  type,
}: SummaryCardProps) {
  const icons = {
    balance: CreditCard,
    revenue: ArrowDownLeft,
    expense: ArrowUpRight,
    savings: PiggyBank,
  };

  const Icon = icons[type];

  return (
    <div className="flex min-w-0 items-center gap-4 rounded-lg bg-[#191b21] px-4 py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#252932] text-[#20d264]">
        <Icon size={19} strokeWidth={2.5} />
      </div>

      <div className="min-w-0">
        <p className="mb-1 text-xs text-[#8b8e98]">{title}</p>
        <p className="truncate text-[22px] font-medium tracking-tight text-white">
          ${value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
}
