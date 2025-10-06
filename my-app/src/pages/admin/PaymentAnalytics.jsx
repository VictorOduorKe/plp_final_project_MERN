import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const PaymentAnalytics = () => {
  const payments = [
    { month: "Jan", revenue: 2000 },
    { month: "Feb", revenue: 3500 },
    { month: "Mar", revenue: 4200 },
    { month: "Apr", revenue: 6100 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">📊 Payment Analytics</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800">Total Revenue</h2>
          <p className="text-3xl font-bold text-violet-600 mt-2">Ksh 15,800</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800">Active Subscribers</h2>
          <p className="text-3xl font-bold text-violet-600 mt-2">245</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800">Most Popular Plan</h2>
          <p className="text-3xl font-bold text-violet-600 mt-2">Pro</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={payments}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#7c3aed" radius={6} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentAnalytics;
