import React, { useEffect, useState } from 'react';
import { FileText, Plus, Edit2, Trash2, X, AlertCircle, Download, Calendar, MapPin, Users } from 'lucide-react';
import { MeetingsAPI } from '../../api/client.js';
import { Meeting } from '../../types/index.js';

export const AdminMeetings: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [minutesFile, setMinutesFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    meetingTitle: '',
    meetingTitleMarathi: '',
    meetingDate: new Date().toISOString().split('T')[0],
    location: 'श्री साईबाबा मंदिर सभागृह, साखर चौकीचीवाडी',
    agendaMarathi: '',
    decisionsMarathi: '',
    attendanceCount: 30,
    isPublic: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await MeetingsAPI.getAll();
      setMeetings(data);
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
    setEditingMeeting(null);
    setMinutesFile(null);
    setFormData({
      meetingTitle: '',
      meetingTitleMarathi: '',
      meetingDate: new Date().toISOString().split('T')[0],
      location: 'श्री साईबाबा मंदिर सभागृह, साखर चौकीचीवाडी',
      agendaMarathi: '',
      decisionsMarathi: '',
      attendanceCount: 30,
      isPublic: true,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Meeting) => {
    setEditingMeeting(m);
    setMinutesFile(null);
    setFormData({
      meetingTitle: m.meetingTitle,
      meetingTitleMarathi: m.meetingTitleMarathi,
      meetingDate: m.meetingDate ? m.meetingDate.split('T')[0] : '',
      location: m.location,
      agendaMarathi: m.agendaMarathi || '',
      decisionsMarathi: m.decisionsMarathi || '',
      attendanceCount: m.attendanceCount || 0,
      isPublic: m.isPublic,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const data = new FormData();
      data.append('meetingTitle', formData.meetingTitle || formData.meetingTitleMarathi);
      data.append('meetingTitleMarathi', formData.meetingTitleMarathi);
      data.append('meetingDate', formData.meetingDate);
      data.append('location', formData.location);
      if (formData.agendaMarathi) data.append('agendaMarathi', formData.agendaMarathi);
      if (formData.decisionsMarathi) data.append('decisionsMarathi', formData.decisionsMarathi);
      if (formData.attendanceCount) data.append('attendanceCount', String(formData.attendanceCount));
      data.append('isPublic', String(formData.isPublic));
      if (minutesFile) {
        data.append('minutesFile', minutesFile);
      }

      if (editingMeeting) {
        await MeetingsAPI.update(editingMeeting.id, data);
      } else {
        await MeetingsAPI.create(data);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save meeting');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Delete meeting record: "${title}"?`)) return;
    try {
      await MeetingsAPI.delete(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete meeting');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Meetings & Resolutions (सभा व ठराव नोंद)</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage gramastha meetings, resolutions, attendance and PDF minutes</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Meeting</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
          </div>
        ) : meetings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-sm border border-slate-200">
            No meetings recorded. Click "Record New Meeting" to add minutes.
          </div>
        ) : (
          meetings.map((m) => (
            <div key={m.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{m.meetingTitleMarathi}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                      <span>{new Date(m.meetingDate).toLocaleDateString('en-GB')}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      <span>{m.location}</span>
                    </span>
                    {m.attendanceCount && (
                      <span className="flex items-center space-x-1 text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                        <Users className="w-3 h-3" />
                        <span>{m.attendanceCount} Attendees</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {m.minutesFileUrl && (
                    <a
                      href={m.minutesFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-xl font-semibold flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Minutes PDF</span>
                    </a>
                  )}
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id, m.meetingTitleMarathi)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {m.agendaMarathi && (
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <div className="font-bold text-slate-800 mb-1">Agenda (अजेंडा / विषय):</div>
                    <div className="text-slate-600 whitespace-pre-line leading-relaxed">{m.agendaMarathi}</div>
                  </div>
                )}

                {m.decisionsMarathi && (
                  <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                    <div className="font-bold text-emerald-900 mb-1">Resolutions (मंजूर ठराव):</div>
                    <div className="text-emerald-800 whitespace-pre-line leading-relaxed">{m.decisionsMarathi}</div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {editingMeeting ? 'Edit Meeting Details' : 'Record Meeting Details'}
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
                <label className="block font-bold text-slate-700 mb-1">Meeting Title (मराठीत) *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. वार्षिक सर्वसाधारण सभा २०२६"
                  value={formData.meetingTitleMarathi}
                  onChange={(e) => setFormData({ ...formData, meetingTitleMarathi: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meeting Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.meetingDate}
                    onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attendance Count</label>
                  <input
                    type="number"
                    value={formData.attendanceCount}
                    onChange={(e) => setFormData({ ...formData, attendanceCount: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location / ठिकाण *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Agenda / विषय (मराठीत)</label>
                <textarea
                  rows={3}
                  placeholder="१. मागील सभेचे इतिवृत्त वाचन..."
                  value={formData.agendaMarathi}
                  onChange={(e) => setFormData({ ...formData, agendaMarathi: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Decisions & Resolutions / मंजूर ठराव</label>
                <textarea
                  rows={3}
                  placeholder="१. सर्वानुमते हिशोब मंजूर करण्यात आला..."
                  value={formData.decisionsMarathi}
                  onChange={(e) => setFormData({ ...formData, decisionsMarathi: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Upload Meeting Minutes (PDF Only)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setMinutesFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700"
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
                  {submitting ? 'Saving...' : 'Save Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
