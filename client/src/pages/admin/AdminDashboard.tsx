import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  CreditCard, 
  Receipt, 
  TrendingUp, 
  AlertCircle, 
  PlusCircle, 
  Calendar, 
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from 'lucide-react';
import { ReportsAPI } from '../../api/client.js';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ReportsAPI.getDashboard()
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number | string) => {
    const num = Number(val || 0);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const currentMonth = stats?.currentMonth;
  const overall = stats?.overallFinance;
  const members = stats?.memberStats;

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar & Fast Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Dashboard Overview</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Financial accounting & membership metrics for {new Date().toLocaleString('default', { month: 'long' })} {currentMonth?.year}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/monthly-contributions"
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Monthly ₹200</span>
          </Link>
          <Link
            to="/admin/expenses"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5"
          >
            <Receipt className="w-4 h-4" />
            <span>Add Expense</span>
          </Link>
        </div>
      </div>

      {/* Current Month Collection Status */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-700/60 pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-orange-400 font-bold">Current Target Status</span>
              <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
                Month {currentMonth?.month} / {currentMonth?.year} (₹{currentMonth?.targetPerMember} per member)
              </h2>
            </div>
            <div className="text-xs text-slate-400">
              Active Members: <strong className="text-white">{members?.active}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div className="text-xs text-slate-400 font-medium">Expected Target</div>
              <div className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
                {formatCurrency(currentMonth?.expected || 0)}
              </div>
            </div>

            <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/60">
              <div className="text-xs text-emerald-300 font-medium">Collected (Members)</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
                {formatCurrency(currentMonth?.memberCollected || 0)}
              </div>
            </div>

            <div className="bg-rose-950/60 p-4 rounded-2xl border border-rose-800/60">
              <div className="text-xs text-rose-300 font-medium">Pending Dues</div>
              <div className="text-xl sm:text-2xl font-bold text-rose-400 mt-1">
                {formatCurrency(currentMonth?.pending || 0)}
              </div>
            </div>

            <div className="bg-blue-950/60 p-4 rounded-2xl border border-blue-800/60">
              <div className="text-xs text-blue-300 font-medium">Outside Donors</div>
              <div className="text-xl sm:text-2xl font-bold text-blue-400 mt-1">
                {formatCurrency(currentMonth?.outsideCollected || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Finances & Member Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Net Balance Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-3">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mandal Net Balance</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 mt-2">
              {formatCurrency(overall?.netBalance || 0)}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100 flex justify-between">
            <span>Opening: {formatCurrency(overall?.openingBalance || 0)}</span>
            <Link to="/admin/reports" className="text-orange-600 font-semibold hover:underline">View Balance Sheet →</Link>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Confirmed Income</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
              {formatCurrency(overall?.totalIncome || 0)}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
            Monthly + Festival + Outside donations
          </div>
        </div>

        {/* Members Breakdown Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Members Breakdown</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">
              {members?.total} Members
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100 flex justify-between">
            <span>Normal: <strong>{members?.normalGroup}</strong></span>
            <span>Youth: <strong>{members?.youthGroup}</strong></span>
            <Link to="/admin/members" className="text-blue-600 font-semibold hover:underline">Manage →</Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Contributions */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-orange-600" />
              <span>Recent Monthly Contributions</span>
            </h3>
            <Link to="/admin/monthly-contributions" className="text-xs text-orange-600 font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats?.recentActivity?.contributions?.map((c: any) => (
              <div key={c.id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <div className="font-semibold text-slate-900">{c.contributorName}</div>
                  <div className="text-xs text-slate-400">
                    Month {c.contributionMonth}/{c.contributionYear} • {c.paymentMethod}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">{formatCurrency(c.amount)}</div>
                  <div className="text-[11px] text-slate-400">{c.receiptNumber}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-red-600" />
              <span>Recent Expenses</span>
            </h3>
            <Link to="/admin/expenses" className="text-xs text-orange-600 font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats?.recentActivity?.expenses?.map((e: any) => (
              <div key={e.id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <div className="font-semibold text-slate-900">{e.titleMarathi || e.title}</div>
                  <div className="text-xs text-slate-400">
                    {e.category?.nameMarathi} • {e.vendorName || 'N/A'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">{formatCurrency(e.amount)}</div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(e.expenseDate).toLocaleDateString('en-GB')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
