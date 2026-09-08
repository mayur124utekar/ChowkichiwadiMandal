import React, { useEffect, useState } from 'react';
import { BarChart3, Printer, Calendar, Users, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { ReportsAPI, MembersAPI } from '../../api/client.js';
import { Group } from '../../types/index.js';

export const AdminReports: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'MATRIX'>('SUMMARY');

  const [summary, setSummary] = useState<any>(null);
  const [matrixData, setMatrixData] = useState<any>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sumRes, matRes, metaRes] = await Promise.all([
        ReportsAPI.getFinancialSummary(selectedYear),
        ReportsAPI.getMonthlyMatrix(selectedYear, selectedGroupId ? parseInt(selectedGroupId, 10) : undefined),
        MembersAPI.getMeta(),
      ]);
      setSummary(sumRes);
      setMatrixData(matRes);
      setGroups(metaRes.groups);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedYear, selectedGroupId]);

  const formatCurrency = (val: number | string) => {
    const num = Number(val || 0);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Financial Reports & Annual Matrix</h1>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit-ready ledger summaries and member payment grid</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-bold"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Tab Switcher */}
      <div className="flex space-x-2 bg-white p-2 rounded-2xl border border-slate-200 w-full sm:w-auto inline-flex print:hidden">
        <button
          onClick={() => setActiveTab('SUMMARY')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'SUMMARY'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Annual Balance Sheet & Income/Expense
        </button>

        <button
          onClick={() => setActiveTab('MATRIX')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'MATRIX'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          12-Month Member Payment Matrix
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
        </div>
      ) : activeTab === 'SUMMARY' ? (
        <div className="space-y-6">
          {/* Printable Annual Balance Sheet */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="text-center border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ - साखर</h2>
              <p className="text-xs text-slate-500 font-medium">वार्षिक जमा-खर्च व ताळेबंद अहवाल (Financial Report {selectedYear})</p>
            </div>

            {/* Formula Balance Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-[11px] text-slate-500 font-bold uppercase">Opening Balance</div>
                <div className="text-lg font-extrabold text-slate-800 mt-1">
                  {formatCurrency(summary?.openingBalance || 0)}
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <div className="text-[11px] text-emerald-700 font-bold uppercase">+ Total Income</div>
                <div className="text-lg font-extrabold text-emerald-700 mt-1">
                  {formatCurrency(summary?.totalIncome || 0)}
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5">
                  Monthly: {formatCurrency(summary?.totalMonthly || 0)} • Festival: {formatCurrency(summary?.totalFestival || 0)}
                </div>
              </div>

              <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                <div className="text-[11px] text-rose-700 font-bold uppercase">- Total Expenses</div>
                <div className="text-lg font-extrabold text-rose-700 mt-1">
                  {formatCurrency(summary?.totalExpenses || 0)}
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                <div className="text-[11px] text-orange-700 font-bold uppercase">= Net Closing Balance</div>
                <div className="text-xl font-extrabold text-orange-600 mt-1">
                  {formatCurrency(summary?.closingBalance || 0)}
                </div>
              </div>
            </div>

            {/* Month by Month Breakdown Table */}
            <div className="pt-4">
              <h3 className="font-bold text-slate-800 text-sm mb-3">Month-by-Month Breakdown ({selectedYear})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                      <th className="py-3 px-4">Month</th>
                      <th className="py-3 px-4 text-emerald-700 font-bold">Income (जमा)</th>
                      <th className="py-3 px-4 text-red-700 font-bold">Expenses (खर्च)</th>
                      <th className="py-3 px-4 text-right">Net Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {summary?.monthlyBreakdown?.map((m: any) => {
                      const net = m.income - m.expense;
                      return (
                        <tr key={m.month} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            Month {m.month}
                          </td>
                          <td className="py-3 px-4 text-emerald-600 font-bold">
                            {formatCurrency(m.income)}
                          </td>
                          <td className="py-3 px-4 text-red-600 font-bold">
                            {formatCurrency(m.expense)}
                          </td>
                          <td className={`py-3 px-4 text-right font-bold ${net >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
                            {formatCurrency(net)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Member Contribution Matrix Tab */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                12-Month Member Contribution Grid ({selectedYear})
              </h3>
              <p className="text-xs text-slate-500">Track which members paid for each month of the year</p>
            </div>

            <div className="flex items-center space-x-2 print:hidden">
              <label className="text-xs font-semibold text-slate-600">Group:</label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5"
              >
                <option value="">All Groups</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.nameMarathi}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Member Name</th>
                  <th className="py-3 px-2">Group</th>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                    <th key={m} className="py-3 px-2 text-center">M{m}</th>
                  ))}
                  <th className="py-3 px-3 text-right">Total Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {matrixData?.matrix?.map((row: any) => (
                  <tr key={row.memberId} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {row.fullNameMarathi || row.fullName}
                    </td>

                    <td className="py-3 px-2 text-slate-500 text-[10px] whitespace-nowrap">
                      {row.group}
                    </td>

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                      const val = row.months[m] || 0;
                      return (
                        <td key={m} className="py-3 px-2 text-center">
                          {val > 0 ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              ₹{val}
                            </span>
                          ) : (
                            <span className="text-slate-300 font-mono">-</span>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-3 px-3 text-right font-extrabold text-emerald-700 whitespace-nowrap">
                      {formatCurrency(row.totalPaid)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
