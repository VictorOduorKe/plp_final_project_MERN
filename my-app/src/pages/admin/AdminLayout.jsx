import { Link, Outlet } from "react-router-dom";
import { BarChart2, Users, Home } from "lucide-react";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-800 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-violet-400 flex flex-col">
        <div className="text-2xl font-bold py-6 text-center border-b border-violet-400">
          AI Planner Admin
        </div>
        <nav className="flex-1 pxz-4 py-6 space-y-3">
          <Link
            to="/admin/payments"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Home size={20} /> Dashboard
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Users size={20} /> All Users
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 mt-10 text-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
