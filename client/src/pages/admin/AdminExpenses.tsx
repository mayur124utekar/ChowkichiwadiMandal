import React, { useEffect, useState } from 'react';
import { Receipt, Plus, Search, X, AlertCircle, Ban, Tag, Upload, FileText } from 'lucide-react';
import { ExpensesAPI } from '../../api/client.js';
import { Expense, ExpenseCategory } from '../../types/index.js';

export const AdminExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    titleMarathi: '',
    description: '',
    amount: 0,
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH',
    vendorName: '',
    billNumber: '',
    isPublic: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [voidingId, setVoidingId] = useState<number | null>(null);
  const [voidReason, setVoidReason] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [expRes, catRes] = await Promise.all([
        ExpensesAPI.getAll({ categoryId: selectedCatId || undefined }),
        ExpensesAPI.getCategories(),
      ]);
      setExpenses(expRes.expenses);
      setTotalExpenses(expRes.totalExpenses);
      setCategories(catRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCatId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const data = new FormData();
      data.append('categoryId', formData.categoryId);
      data.append('title', formData.title);
      data.append('titleMarathi', formData.titleMarathi || formData.title);
      if (formData.description) data.append('description', formData.description);
      data.append('amount', String(formData.amount));
      data.append('expenseDate', formData.expenseDate);
      data.append('paymentMethod', formData.paymentMethod);
      if (formData.vendorName) data.append('vendorName', formData.vendorName);
      if (formData.billNumber) data.append('billNumber', formData.billNumber);
      data.append('isPublic', String(formData.isPublic));
      if (receiptFile) {
        data.append('receipt', receiptFile);
      }

      await ExpensesAPI.create(data);
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoid = async () => {
    if (!voidingId) return;
    try {
      await ExpensesAPI.void(voidingId, voidReason || 'Voided by admin');
      setVoidingId(null);
      setVoidReason('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to void expense');
    }
  };

  const formatCurrency = (val: number | string) => {
    const num = Number(val || 0);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Expenses Management (खर्च व्यवस्थापन)</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track categorize payments, bill numbers, and uploaded vendor receipts</p>
        </div>

        <button
          onClick={() => {
            setFormData({
              categoryId: categories[0]?.id ? String(categories[0].id) : '',
              title: '',
              titleMarathi: '',
              description: '',
              amount: 0,
              expenseDate: new Date().toISOString().split('T')[0],
              paymentMethod: 'CASH',
              vendorName: '',
              billNumber: '',
              isPublic: true,
            });
            setReceiptFile(null);
            setErrorMsg('');
            setIsModalOpen(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Filter and Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Filter Category:</label>
          <select
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameMarathi}</option>
            ))}
          </select>
        </div>

        <div className="text-xs font-bold text-red-700 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
          Total Expenses: {formatCurrency(totalExpenses)}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No expenses recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Expense Title / Details</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Vendor / Bill</th>
                  <th className="py-3.5 px-6">Method</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Receipt</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                      {new Date(exp.expenseDate).toLocaleDateString('en-GB')}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{exp.titleMarathi || exp.title}</div>
                      <div className="text-[11px] text-slate-400">{exp.title}</div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-lg text-[10px]">
                        {exp.category?.nameMarathi}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-700">
                      <div>{exp.vendorName || '—'}</div>
                      {exp.billNumber && <div className="text-[10px] text-slate-400">Bill: {exp.billNumber}</div>}
                    </td>

                    <td className="py-4 px-6 font-medium text-slate-700">
                      {exp.paymentMethod}
                    </td>

                    <td className="py-4 px-6 font-extrabold text-red-600 text-sm whitespace-nowrap">
                      {formatCurrency(exp.amount)}
                    </td>

                    <td className="py-4 px-6">
                      {exp.receiptUrl ? (
                        <a
                          href={exp.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-orange-600 hover:underline font-semibold flex items-center space-x-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View</span>
                        </a>
                      ) : (
                        <span className="text-slate-300 italic">None</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        exp.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {exp.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      {exp.status === 'CONFIRMED' && (
                        <button
                          onClick={() => setVoidingId(exp.id)}
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

      {/* Record Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900">Record Mandal Expense (खर्च नोंद)</h2>
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

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Expense Category (वर्गवारी) *</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameMarathi}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title (मराठीत) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. मंडप सजावट"
                    value={formData.titleMarathi}
                    onChange={(e) => setFormData({ ...formData, titleMarathi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mandap Decoration"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-red-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expense Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.expenseDate}
                    onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Method *</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="CASH">Cash (रोख)</option>
                    <option value="UPI">UPI</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vendor / Shop Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rane Traders"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bill / Receipt Attachment (Image or PDF)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="expIsPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <label htmlFor="expIsPublic" className="font-semibold text-slate-700 cursor-pointer">
                  Show on Public Website Expense List
                </label>
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
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Recording...' : 'Record Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Void Modal */}
      {voidingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2 text-rose-600">
              <Ban className="w-5 h-5" />
              <span>Void Expense Entry</span>
            </h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to void this expense? It will reverse the deduction in the financial ledger.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Voiding:</label>
              <input
                type="text"
                required
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                placeholder="Reason..."
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
                className="px-4 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
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
