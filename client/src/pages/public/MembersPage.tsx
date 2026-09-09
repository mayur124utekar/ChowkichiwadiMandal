import React, { useEffect, useState } from 'react';
import { Users, Search, Filter } from 'lucide-react';
import { PublicAPI } from '../../api/client.js';
import { Member } from '../../types/index.js';
import { MemberAvatar } from '../../components/MemberAvatar.js';

export const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const groupParam = selectedGroup === 'ALL' ? undefined : selectedGroup;
    PublicAPI.getMembers(groupParam)
      .then((data) => setMembers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedGroup]);

  const filteredMembers = members.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (m.fullNameMarathi && m.fullNameMarathi.toLowerCase().includes(q)) ||
      m.fullName.toLowerCase().includes(q) ||
      (m.position?.nameMarathi && m.position.nameMarathi.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3.5 py-1 rounded-full text-xs font-semibold">
          <Users className="w-4 h-4 text-orange-600" />
          <span>ग्रामस्थ व युवा कार्यकारणी</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          मंडळाचे सन्माननीय सदस्य
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळाच्या सामान्य व युवा ग्रुपचे सर्व पदाधिकारी व सदस्य.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Group Tabs */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedGroup('ALL')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              selectedGroup === 'ALL'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
            }`}
          >
            सर्व सदस्य ({members.length})
          </button>
          <button
            onClick={() => setSelectedGroup('YOUTH')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              selectedGroup === 'YOUTH'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
            }`}
          >
            युवा ग्रुप (युवा मंडळ)
          </button>
          <button
            onClick={() => setSelectedGroup('NORMAL')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              selectedGroup === 'NORMAL'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
            }`}
          >
            सामान्य ग्रुप
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="सदस्य नाव किंवा पद शोधा..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-base">कोणतेही सदस्य सापडले नाहीत.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl p-5 border border-orange-100/90 shadow-sm hover:shadow-md transition text-center flex flex-col items-center group"
            >
              <div className="p-1 rounded-full border-2 border-orange-200 group-hover:border-orange-500 transition-colors bg-orange-50 mb-3">
                <MemberAvatar
                  photoUrl={member.photoUrl}
                  name={member.fullNameMarathi || member.fullName}
                  size="lg"
                />
              </div>

              <h3 className="font-bold text-gray-900 text-base leading-snug">
                {member.fullNameMarathi || member.fullName}
              </h3>

              <div className="mt-1.5 inline-block bg-orange-100/80 text-orange-800 text-xs px-3 py-0.5 rounded-full font-semibold">
                {member.position?.nameMarathi || 'सदस्य'}
              </div>

              <div className="text-xs text-gray-400 mt-2">
                {member.group?.nameMarathi}
              </div>

              {member.bioMarathi && (
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic">
                  "{member.bioMarathi}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
