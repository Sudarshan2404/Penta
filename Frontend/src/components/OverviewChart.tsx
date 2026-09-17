import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface OverviewChartProps {
  trends: {
    _id: {
      year: number;
      month: number;
      category: "Revenue" | "Expense";
    };
    total: number;
  }[];
}

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function OverviewChart({ trends }: OverviewChartProps) {
  const chartData = months.map((month, index) => {
    const revenue = trends.find(
      (item) =>
        item._id.month === index + 1 &&
        item._id.category === "Revenue"
    );

    const expense = trends.find(
      (item) =>
        item._id.month === index + 1 &&
        item._id.category === "Expense"
    );

    return {
      month,
      revenue: revenue?.total ?? 0,
      expense: expense?.total ?? 0,
    };
  });

  if (!trends.length) {
    return <div className="flex h-[270px] items-center justify-center text-sm text-[#777b85]">No transaction data is available for the chart.</div>;
  }

  return (
    <div className="h-[270px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            stroke="#292c34"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#7d808a", fontSize: 11 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#7d808a", fontSize: 10 }}
            tickFormatter={(value) => `$${value}`}
          />

          <Tooltip
            contentStyle={{
              background: "#1c1f26",
              border: "1px solid #30343e",
              borderRadius: 8,
              color: "#fff",
            }}
            formatter={(value) => [`$${value ?? 0}`, ""]}
          />

          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{
              fontSize: 11,
              color: "#8b8e98",
              paddingBottom: 18,
            }}
          />

          <Line
            name="Income"
            type="monotone"
            dataKey="revenue"
            stroke="#20d264"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />

          <Line
            name="Expenses"
            type="monotone"
            dataKey="expense"
            stroke="#f2bd22"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
