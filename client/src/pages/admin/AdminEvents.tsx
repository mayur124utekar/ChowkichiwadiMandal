import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Edit2, X, AlertCircle, Tag, Users } from 'lucide-react';
import { EventsAPI } from '../../api/client.js';
import { Event } from '../../types/index.js';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    nameMarathi: '',
    description: '',
    descriptionMarathi: '',
    eventDate: new Date().toISOString().split('T')[0],
    startDate: '',
    endDate: '',
    year: new Date().getFullYear(),
    targetAmount: 50000,
    status: 'UPCOMING',
    isPublic: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await EventsAPI.getAll();
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      nameMarathi: '',
      description: '',
      descriptionMarathi: '',
      eventDate: new Date().toISOString().split('T')[0],
      startDate: '',
      endDate: '',
      year: new Date().getFullYear(),
      targetAmount: 50000,
      status: 'UPCOMING',
      isPublic: true,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: Event) => {
    setEditingEvent(ev);
    setFormData({
      name: ev.name,
      nameMarathi: ev.nameMarathi,
      description: ev.description || '',
      descriptionMarathi: ev.descriptionMarathi || '',
      eventDate: ev.eventDate ? ev.eventDate.split('T')[0] : '',
      startDate: ev.startDate ? ev.startDate.split('T')[0] : '',
      endDate: ev.endDate ? ev.endDate.split('T')[0] : '',
      year: ev.year,
      targetAmount: ev.targetAmount ? Number(ev.targetAmount) : 0,
      status: ev.status,
      isPublic: ev.isPublic,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      if (editingEvent) {
        await EventsAPI.update(editingEvent.id, formData);
      } else {
        await EventsAPI.create(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
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
          <h1 className="text-xl font-bold text-slate-900">Events & Festivals (उत्सव व कार्यक्रम)</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage annual Ganeshotsav, Palkhi Sohala, and cultural programs</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev) => (
          <div key={ev.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Year {ev.year}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  ev.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
                  ev.status === 'ONGOING' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {ev.status}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base">{ev.nameMarathi}</h3>
              <p className="text-xs text-slate-500">{ev.name}</p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Target Budget:</span>
                  <strong>{formatCurrency(ev.targetAmount || 0)}</strong>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200/60 pt-1.5">
                  <span>Total Collected:</span>
                  <span>{formatCurrency(ev.totalCollected || 0)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-400">{ev.contributionsCount || 0} donors</span>
              <button
                onClick={() => handleOpenEdit(ev)}
                className="text-orange-600 hover:text-orange-700 font-bold flex items-center space-x-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {editingEvent ? 'Edit Event Details' : 'Create New Event / Festival'}
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

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Event Name (मराठीत) *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. श्री गणेशोत्सव २०२६"
                  value={formData.nameMarathi}
                  onChange={(e) => setFormData({ ...formData, nameMarathi: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Event Name (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shree Ganeshotsav 2026"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Budget (₹)</label>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="UPCOMING">UPCOMING (आगामी)</option>
                    <option value="ONGOING">ONGOING (चालू)</option>
                    <option value="COMPLETED">COMPLETED (संपन्न)</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (मराठीत)</label>
                <textarea
                  rows={3}
                  placeholder="उत्सवाचा सविस्तर तपशील..."
                  value={formData.descriptionMarathi}
                  onChange={(e) => setFormData({ ...formData, descriptionMarathi: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                ></textarea>
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
                  {submitting ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
