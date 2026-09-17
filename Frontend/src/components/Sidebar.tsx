import {
  BarChart3,
  ChevronDown,
  CreditCard,
  Grid2X2,
  Mail,
  Settings,
  UserRound,
  Wallet,
} from "lucide-react";

import PentaLogo from "../assets/Penta.svg";
import defaultAvatar from "../assets/defaultAvtar.svg";

interface SidebarProps {
  active: string;
  onChange: (item: string) => void;
  userName?: string;
  avatar?: string;
}

const items = [
  { label: "Dashboard", icon: Grid2X2 },
  { label: "Transactions", icon: CreditCard },
  { label: "Wallet", icon: Wallet },
  { label: "Analytics", icon: BarChart3 },
  { label: "Personal", icon: UserRound },
  { label: "Message", icon: Mail },
  { label: "Setting", icon: Settings },
];

export default function Sidebar({
  active,
  onChange,
  userName = "Financial Analyst",
  avatar,
}: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[210px] flex-col bg-[#17191f] px-5 py-7">
      <div className="mb-12 flex items-center gap-2 px-2">
        {/* <div className="relative h-7 w-7">
          <span className="absolute left-0 top-1 h-4 w-2 rounded-sm bg-[#20d264]" />
          <span className="absolute left-2 top-0 h-2 w-5 rounded-sm bg-[#20d264]" />
          <span className="absolute right-0 top-1 h-5 w-2 rounded-sm bg-[#f2bd22]" />
        </div> */}
        <img src={PentaLogo} alt="pentLogo" />
        <span className="text-[25px] font-semibold tracking-tight text-white">
          Penta
        </span>
      </div>

      <nav className="space-y-2">
        {items.map(({ label, icon: Icon }) => {
          const selected = active === label;

          return (
            <button
              key={label}
              onClick={() => onChange(label)}
              className={`group relative flex w-full items-center gap-4 rounded-lg px-2 py-3 text-left text-[13px] transition ${
                selected
                  ? "text-[#20d264]"
                  : "text-[#8d9099] hover:bg-[#20232b] hover:text-white"
              }`}
            >
              {selected && (
                <span className="absolute -right-5 top-1/2 h-5 w-1 -translate-y-1/2 rounded-l bg-[#f2bd22]" />
              )}

              <Icon size={19} strokeWidth={selected ? 2.5 : 1.6} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl bg-[#1e2129] p-3">
        <div className="flex items-center gap-3">
          <img
            src={avatar || defaultAvatar}
            alt="Profile"
            className="h-9 w-9 rounded-full object-cover"
            onError={(event) => { event.currentTarget.src = defaultAvatar; }}
          />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">
              {userName}
            </p>
            <p className="text-[11px] text-[#777b85]">My account</p>
          </div>
          <ChevronDown size={15} className="ml-auto text-[#777b85]" />
        </div>
      </div>
    </aside>
  );
}
