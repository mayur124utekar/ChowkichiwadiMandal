import React, { useEffect, useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Calendar, 
  X, 
  AlertCircle, 
  ShieldCheck, 
  Ban, 
  CheckCircle2, 
  Printer 
} from 'lucide-react';
import { ContributionsAPI, MembersAPI } from '../../api/client.js';
import { MonthlyContribution, Member } from '../../types/index.js';

export const AdminMonthlyContributions: React.FC = () => {
  const [contributions, setContributions] = useState<MonthlyContribution[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contributorType, setContributorType] = useState<'MEMBER' | 'OUTSIDE_PERSON'>('MEMBER');
  const [formData, setFormData] = useState({
    memberId: '',
    contributorName: '',
    amount: 200,
    contributionMonth: currentMonth,
    contributionYear: currentYear,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Void modal
  const [voidingId, setVoidingId] = useState<number | null>(null);
  const [voidReason, setVoidReason] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [contribRes, membersRes] = await Promise.all([
        ContributionsAPI.getMonthly({
          year: selectedYear,
          month: selectedMonth,
        }),
        MembersAPI.getAll({ isActive: true }),
      ]);
      setContributions(contribRes.contributions);
      setTotalCollected(contribRes.totalCollected);
      setMembers(membersRes.members);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedYear, selectedMonth]);

  const handleMemberSelect = (memberId: string) => {
    const mem = members.find((m) => String(m.id) === memberId);
    setFormData({
      ...formData,
      memberId,
      contributorName: mem ? (mem.fullNameMarathi || mem.fullName) : '',
    });
  };

  const handleCreateContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      await ContributionsAPI.createMonthly({
        memberId: contributorType === 'MEMBER' && formData.memberId ? parseInt(formData.memberId, 10) : null,
        contributorName: formData.contributorName,
        contributorType,
        amount: Number(formData.amount),
        contributionMonth: Number(formData.contributionMonth),
        contributionYear: Number(formData.contributionYear),
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || null,
        isPublic: true,
      });

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record contribution');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoid = async () => {
    if (!voidingId) return;
    try {
      await ContributionsAPI.voidMonthly(voidingId, voidReason || 'Voided by admin');
      setVoidingId(null);
      setVoidReason('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to void contribution');
    }
  };

  const formatCurrency = (val: number | string) => {
    const num = Number(val || 0);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Monthly Contributions (मासिक वर्गणी)</h1>
          <p className="text-xs text-slate-500 mt-0.5">Record monthly collections and manage receipt numbers</p>
        </div>

        <button
          onClick={() => {
            setFormData({
              memberId: members[0]?.id ? String(members[0].id) : '',
              contributorName: members[0] ? (members[0].fullNameMarathi || members[0].fullName) : '',
              amount: 200,
              contributionMonth: selectedMonth,
              contributionYear: selectedYear,
              paymentDate: new Date().toISOString().split('T')[0],
              paymentMethod: 'CASH',
              notes: '',
            });
            setErrorMsg('');
            setIsModalOpen(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Record Payment (₹200)</span>
        </button>
      </div>

      {/* Filter Selector & Month Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Month Selector Filter */}
        <div className="md:col-span-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
            <Calendar className="w-4 h-4 text-orange-600" />
            <span>Select Period:</span>
          </div>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5 font-bold"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <div className="flex flex-wrap gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedMonth === m
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                M{m}
              </button>
            ))}
          </div>
        </div>

        {/* Total Collected Card */}
        <div className="md:col-span-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Total Month {selectedMonth}/{selectedYear}
            </div>
            <div className="text-2xl font-extrabold text-emerald-700 mt-0.5">
              {formatCurrency(totalCollected)}
            </div>
          </div>
          <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-xl font-bold text-xs">
            {contributions.filter(c => c.status === 'CONFIRMED').length} Paid
          </div>
        </div>
      </div>

      {/* Contributions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
          </div>
        ) : contributions.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No contributions recorded for Month {selectedMonth}/{selectedYear}. Click "Record Payment" to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Receipt No</th>
                  <th className="py-3.5 px-6">Contributor</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Method</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contributions.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-mono font-semibold text-slate-800">
                      {c.receiptNumber || `REC-${c.id}`}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{c.contributorName}</div>
                      {c.member?.group && (
                        <div className="text-[11px] text-slate-400">{c.member.group.nameMarathi}</div>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.contributorType === 'MEMBER' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {c.contributorType === 'MEMBER' ? 'Member' : 'Outside Person'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-600">
                      {new Date(c.paymentDate).toLocaleDateString('en-GB')}
                    </td>

                    <td className="py-4 px-6 font-medium text-slate-700">
                      {c.paymentMethod}
                    </td>

                    <td className="py-4 px-6 font-extrabold text-emerald-600 text-sm">
                      {formatCurrency(c.amount)}
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        c.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      {c.status === 'CONFIRMED' && (
                        <button
                          onClick={() => setVoidingId(c.id)}
                          className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg text-[11px] font-semibold transition border border-rose-200"
                        >
                          Void
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Contribution Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Record Monthly Contribution (मासिक वर्गणी)
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateContribution} className="space-y-4 text-xs">
              {/* Contributor Type Selection */}
              <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setContributorType('MEMBER')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    contributorType === 'MEMBER' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Mandal Member (सभासद)
                </button>
                <button
                  type="button"
                  onClick={() => setContributorType('OUTSIDE_PERSON')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    contributorType === 'OUTSIDE_PERSON' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Outside Person (ग्रामस्थ / देणगीदार)
                </button>
              </div>

              {contributorType === 'MEMBER' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Member *</label>
                  <select
                    required
                    value={formData.memberId}
                    onChange={(e) => handleMemberSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="">-- Choose Member --</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullNameMarathi || m.fullName} ({m.group?.nameMarathi})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contributor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kadam (Mumbai)"
                    value={formData.contributorName}
                    onChange={(e) => setFormData({ ...formData, contributorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Month *</label>
                  <select
                    value={formData.contributionMonth}
                    onChange={(e) => setFormData({ ...formData, contributionMonth: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                      <option key={m} value={m}>Month {m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Year *</label>
                  <input
                    type="number"
                    value={formData.contributionYear}
                    onChange={(e) => setFormData({ ...formData, contributionYear: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Method *</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="CASH">Cash (रोख)</option>
                    <option value="UPI">UPI (Google Pay / PhonePe)</option>
                    <option value="BANK_TRANSFER">Bank Transfer (NEFT/IMPS)</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Date *</label>
                <input
                  type="date"
                  required
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarks / Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Paid via UPI"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Recording...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Void Modal Confirmation */}
      {voidingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2 text-rose-600">
              <Ban className="w-5 h-5" />
              <span>Void Transaction</span>
            </h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to void this contribution? This action will reverse the ledger transaction and be logged permanently in audit logs.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Voiding:</label>
              <input
                type="text"
                required
                placeholder="e.g. Entered wrong member"
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setVoidingId(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleVoid}
                className="px-4 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow"
              >
                Confirm Void
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
