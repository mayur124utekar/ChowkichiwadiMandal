import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Upload, 
  Check, 
  AlertCircle,
  Phone,
  Shield
} from 'lucide-react';
import { MembersAPI } from '../../api/client.js';
import { Member, Group, Position } from '../../types/index.js';
import { MemberAvatar } from '../../components/MemberAvatar.js';

export const AdminMembers: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    fullNameMarathi: '',
    groupId: '',
    positionId: '',
    mobileNumber: '',
    joiningDate: new Date().toISOString().split('T')[0],
    bioMarathi: '',
    displayOrder: 0,
    isActive: true,
    isPublic: true,
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [membersRes, metaRes] = await Promise.all([
        MembersAPI.getAll({ groupId: selectedGroupId || undefined, search: search || undefined }),
        MembersAPI.getMeta(),
      ]);
      setMembers(membersRes.members);
      setGroups(metaRes.groups);
      setPositions(metaRes.positions);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedGroupId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setPhotoFile(null);
    setFormData({
      fullName: '',
      fullNameMarathi: '',
      groupId: groups[0]?.id ? String(groups[0].id) : '',
      positionId: '',
      mobileNumber: '',
      joiningDate: new Date().toISOString().split('T')[0],
      bioMarathi: '',
      displayOrder: members.length + 1,
      isActive: true,
      isPublic: true,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: Member) => {
    setEditingMember(member);
    setPhotoFile(null);
    setFormData({
      fullName: member.fullName,
      fullNameMarathi: member.fullNameMarathi || '',
      groupId: String(member.groupId),
      positionId: member.positionId ? String(member.positionId) : '',
      mobileNumber: member.mobileNumber || '',
      joiningDate: member.joiningDate ? member.joiningDate.split('T')[0] : '',
      bioMarathi: member.bioMarathi || '',
      displayOrder: member.displayOrder,
      isActive: member.isActive,
      isPublic: member.isPublic,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('fullNameMarathi', formData.fullNameMarathi || formData.fullName);
      data.append('groupId', formData.groupId);
      if (formData.positionId) data.append('positionId', formData.positionId);
      if (formData.mobileNumber) data.append('mobileNumber', formData.mobileNumber);
      if (formData.joiningDate) data.append('joiningDate', formData.joiningDate);
      if (formData.bioMarathi) data.append('bioMarathi', formData.bioMarathi);
      data.append('displayOrder', String(formData.displayOrder));
      data.append('isActive', String(formData.isActive));
      data.append('isPublic', String(formData.isPublic));
      if (photoFile) {
        data.append('photo', photoFile);
      }

      if (editingMember) {
        await MembersAPI.update(editingMember.id, data);
      } else {
        await MembersAPI.create(data);
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete member: ${name}? (Records will be soft-deleted safely)`)) {
      return;
    }

    try {
      await MembersAPI.delete(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete member');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Member Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage Normal and Youth group committee members</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Group Selector */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Group:</label>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Groups</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.nameMarathi} ({g.name})</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </form>
      </div>

      {/* Member Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No members found. Click "Add New Member" to register one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Member Details</th>
                  <th className="py-3.5 px-6">Group</th>
                  <th className="py-3.5 px-6">Position</th>
                  <th className="py-3.5 px-6">Mobile (Admin Only)</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 flex items-center space-x-3">
                      <MemberAvatar
                        photoUrl={m.photoUrl}
                        name={m.fullNameMarathi || m.fullName}
                        size="sm"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{m.fullNameMarathi || m.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{m.fullName}</div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg text-[11px]">
                        {m.group?.nameMarathi}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-medium text-slate-800">
                      {m.position?.nameMarathi || 'सदस्य'}
                    </td>

                    <td className="py-4 px-6 text-slate-600">
                      {m.mobileNumber ? (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{m.mobileNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Not set</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        m.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {m.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditModal(m)}
                        className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                        title="Edit Member"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id, m.fullNameMarathi || m.fullName)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {editingMember ? 'Edit Member Details' : 'Add New Mandal Member'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Santosh Kadam"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">पूर्ण नाव (मराठीत) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. संतोष कदम"
                    value={formData.fullNameMarathi}
                    onChange={(e) => setFormData({ ...formData, fullNameMarathi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Group *</label>
                  <select
                    required
                    value={formData.groupId}
                    onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.nameMarathi} ({g.name})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Position / पद</label>
                  <select
                    value={formData.positionId}
                    onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="">सदस्य (Default)</option>
                    {positions.map((p) => (
                      <option key={p.id} value={p.id}>{p.nameMarathi} ({p.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number (Private)</label>
                  <input
                    type="tel"
                    placeholder="9822XXXXXX"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Member Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Bio (मराठीत)</label>
                <textarea
                  rows={2}
                  placeholder="उदा. सल्लागार, सामाजिक व अध्यात्मिक नियोजन."
                  value={formData.bioMarathi}
                  onChange={(e) => setFormData({ ...formData, bioMarathi: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="font-semibold text-slate-700">Active Member</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="font-semibold text-slate-700">Show on Public Portal</span>
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
                  disabled={saving}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
