import React, { useEffect, useState } from 'react';
import { Calendar, Plus, X, AlertCircle, Ban } from 'lucide-react';
import { ContributionsAPI, EventsAPI, MembersAPI } from '../../api/client.js';
import { FestivalContribution, Event, Member } from '../../types/index.js';

export const AdminFestivalContributions: React.FC = () => {
  const [contributions, setContributions] = useState<FestivalContribution[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contributorType, setContributorType] = useState<'MEMBER' | 'OUTSIDE_PERSON'>('MEMBER');
  const [formData, setFormData] = useState({
    eventId: '',
    memberId: '',
    contributorName: '',
    amount: 500,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [voidingId, setVoidingId] = useState<number | null>(null);
  const [voidReason, setVoidReason] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [contribRes, eventsRes, membersRes] = await Promise.all([
        ContributionsAPI.getFestival({ eventId: selectedEventId || undefined }),
        EventsAPI.getAll(),
        MembersAPI.getAll({ isActive: true }),
      ]);
      setContributions(contribRes.contributions);
      setTotalCollected(contribRes.totalCollected);
      setEvents(eventsRes);
      setMembers(membersRes.members);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedEventId]);

  const handleMemberSelect = (memberId: string) => {
    const mem = members.find((m) => String(m.id) === memberId);
    setFormData({
      ...formData,
      memberId,
      contributorName: mem ? (mem.fullNameMarathi || mem.fullName) : '',
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      await ContributionsAPI.createFestival({
        eventId: parseInt(formData.eventId, 10),
        memberId: contributorType === 'MEMBER' && formData.memberId ? parseInt(formData.memberId, 10) : null,
        contributorName: formData.contributorName,
        contributorType,
        amount: Number(formData.amount),
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || null,
        isPublic: true,
      });

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record festival contribution');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoid = async () => {
    if (!voidingId) return;
    try {
      await ContributionsAPI.voidFestival(voidingId, voidReason || 'Voided by admin');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Festival Contributions (उत्सव वर्गणी)</h1>
          <p className="text-xs text-slate-500 mt-0.5">Collect and manage contributions for Ganeshotsav, Palkhi Sohala, and other events</p>
        </div>

        <button
          onClick={() => {
            setFormData({
              eventId: events[0]?.id ? String(events[0].id) : '',
              memberId: members[0]?.id ? String(members[0].id) : '',
              contributorName: members[0] ? (members[0].fullNameMarathi || members[0].fullName) : '',
              amount: 500,
              paymentDate: new Date().toISOString().split('T')[0],
              paymentMethod: 'UPI',
              notes: '',
            });
            setErrorMsg('');
            setIsModalOpen(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Record Festival Contribution</span>
        </button>
      </div>

      {/* Filter and Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Filter Festival/Event:</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
          >
            <option value="">All Festivals</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.nameMarathi} ({ev.year})</option>
            ))}
          </select>
        </div>

        <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
          Total Collection: {formatCurrency(totalCollected)}
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
            No festival contributions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Receipt No</th>
                  <th className="py-3.5 px-6">Event</th>
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
                      {c.receiptNumber || `FEST-${c.id}`}
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {c.event?.nameMarathi || 'Event'}
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-900">
                      {c.contributorName}
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

                    <td className="py-4 px-6 text-right">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900">Record Festival Contribution</h2>
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
                <label className="block font-bold text-slate-700 mb-1">Select Event / Festival *</label>
                <select
                  required
                  value={formData.eventId}
                  onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="">-- Choose Event --</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.nameMarathi} ({ev.year})</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setContributorType('MEMBER')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    contributorType === 'MEMBER' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Mandal Member
                </button>
                <button
                  type="button"
                  onClick={() => setContributorType('OUTSIDE_PERSON')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    contributorType === 'OUTSIDE_PERSON' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Outside Contributor
                </button>
              </div>

              {contributorType === 'MEMBER' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Member *</label>
                  <select
                    required
                    value={formData.memberId}
                    onChange={(e) => handleMemberSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
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
                    placeholder="e.g. Shri Vithal Surve (Mumbai)"
                    value={formData.contributorName}
                    onChange={(e) => setFormData({ ...formData, contributorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              )}

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
                    <option value="UPI">UPI (Google Pay / PhonePe)</option>
                    <option value="CASH">Cash (रोख)</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
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

      {/* Void Modal */}
      {voidingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2 text-rose-600">
              <Ban className="w-5 h-5" />
              <span>Void Festival Contribution</span>
            </h3>
            <p className="text-xs text-slate-600">
              Confirm voiding this contribution? It will update the financial ledger accordingly.
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
