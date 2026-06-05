import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ── Helpers ── */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getLast6Months() {
  const result = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ year: d.getFullYear(), month: d.getMonth(), label: MONTHS[d.getMonth()] });
  }
  return result;
}

function formatAmount(value) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
}

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="font-semibold" style={{ marginBottom: "var(--space-2)" }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, fontSize: "var(--font-size-sm)" }}>
          {entry.name}: {formatAmount(entry.value)}
        </p>
      ))}
    </div>
  );
}

/* ── Main Component ── */
const Reports = () => {
  const { allTransactions } = useSelector((state) => state.transactions);
  const [activeChart, setActiveChart] = useState("trend");

  /* Monthly trend — last 6 months */
  const monthlyData = useMemo(() => {
    const months = getLast6Months();
    return months.map(({ year, month, label }) => {
      const monthTx = allTransactions.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() === month;
      });
      const income = monthTx
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTx
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);
      return { label, income, expense };
    });
  }, [allTransactions]);

  /* Top 5 transactions by amount */
  const topTransactions = useMemo(() => {
    return [...allTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((t) => ({
        name: t.name.length > 14 ? t.name.slice(0, 14) + "…" : t.name,
        amount: t.amount,
        type: t.type,
      }));
  }, [allTransactions]);

  if (allTransactions.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="empty-state">
          <p>No transaction data yet. Add some transactions to see reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">

      {/* Header */}
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h2>Reports</h2>
        <p className="text-muted">Visual breakdown of your financial activity.</p>
      </div>

      {/* Chart tabs */}
      <div className="filter-group" style={{ marginBottom: "var(--space-6)", display: "inline-flex" }}>
        <button
          className={`filter-btn ${activeChart === "trend" ? "active" : ""}`}
          onClick={() => setActiveChart("trend")}
        >
          Monthly Trend
        </button>
        <button
          className={`filter-btn ${activeChart === "top" ? "active" : ""}`}
          onClick={() => setActiveChart("top")}
        >
          Top Transactions
        </button>
      </div>

      {/* Monthly Income vs Expense Chart */}
      {activeChart === "trend" && (
        <div className="card">
          <h3 style={{ marginBottom: "var(--space-6)" }}>
            Income vs Expense — Last 6 Months
          </h3>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={monthlyData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 13, fill: "var(--color-text-secondary)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatAmount}
                tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "var(--font-size-sm)", paddingTop: "var(--space-4)" }}
              />
              <Bar dataKey="income" name="Income" fill="var(--color-success)"
                radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="var(--color-danger)"
                radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Transactions Chart */}
      {activeChart === "top" && (
        <div className="card">
          <h3 style={{ marginBottom: "var(--space-6)" }}>
            Top 5 Transactions by Amount
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topTransactions}
              layout="vertical"
              margin={{ top: 8, right: 40, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={formatAmount}
                tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 13, fill: "var(--color-text-secondary)" }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                name="Amount"
                radius={[0, 4, 4, 0]}
                fill="var(--color-primary)"
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Legend below */}
          <div className="transaction-list" style={{ marginTop: "var(--space-6)" }}>
            {topTransactions.map((t, i) => (
              <div key={i} className="transaction-item">
                <div className="transaction-info">
                  <span className="font-medium">{t.name}</span>
                  <span className={`badge ${t.type === "INCOME" ? "badge-income" : "badge-expense"}`}>
                    {t.type}
                  </span>
                </div>
                <span className={`font-semibold ${t.type === "INCOME" ? "text-success" : "text-danger"}`}>
                  {formatAmount(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Reports;