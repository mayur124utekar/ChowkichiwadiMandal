import React, { useEffect, useState, useMemo } from 'react';
import { FileText, Calendar, MapPin, Users, CheckCircle2, Download, Search, Filter, RefreshCw, Layers } from 'lucide-react';
import { PublicAPI } from '../../api/client.js';
import { Meeting } from '../../types/index.js';

const MARATHI_MONTHS = [
  { value: '1', label: 'जानेवारी (Jan)' },
  { value: '2', label: 'फेब्रुवारी (Feb)' },
  { value: '3', label: 'मार्च (Mar)' },
  { value: '4', label: 'एप्रिल (Apr)' },
  { value: '5', label: 'मे (May)' },
  { value: '6', label: 'जून (Jun)' },
  { value: '7', label: 'जुलै (Jul)' },
  { value: '8', label: 'ऑगस्ट (Aug)' },
  { value: '9', label: 'सप्टेंबर (Sep)' },
  { value: '10', label: 'ऑक्टोबर (Oct)' },
  { value: '11', label: 'नोव्हेंबर (Nov)' },
  { value: '12', label: 'डिसेंबर (Dec)' },
];

export const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');

  useEffect(() => {
    PublicAPI.getMeetings()
      .then((data) => setMeetings(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      const matchSearch =
        searchTerm.trim() === '' ||
        (meeting.meetingTitleMarathi && meeting.meetingTitleMarathi.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (meeting.agendaMarathi && meeting.agendaMarathi.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (meeting.decisionsMarathi && meeting.decisionsMarathi.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (meeting.location && meeting.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const mDate = meeting.meetingDate ? new Date(meeting.meetingDate) : null;
      const mMonth = mDate ? (mDate.getMonth() + 1).toString() : '';
      const matchMonth = selectedMonth === 'ALL' || mMonth === selectedMonth;

      return matchSearch && matchMonth;
    });
  }, [meetings, searchTerm, selectedMonth]);

  const hasActiveFilters = searchTerm !== '' || selectedMonth !== 'ALL';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide">
          <FileText className="w-4 h-4 text-orange-600" />
          <span>ग्रामस्थ सभा व इतिवृत्त</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          मागील सभा व अधिकृत इतिवृत्त
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ (युवा ग्रुप) बैठकांचे अधिकृत विषय, अजेंडा, उपस्थिती आणि मंजूर करण्यात आलेले सर्व महत्त्वपूर्ण ठराव.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-200 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              एकूण नोंदवलेल्या सभा
            </div>
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {meetings.length} <span className="text-sm font-medium text-gray-500">सभा</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-100 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              पारदर्शक निर्णय व ठराव
            </div>
            <div className="text-2xl font-black text-emerald-600 tracking-tight">
              १००% <span className="text-sm font-medium text-gray-500">मंजूर</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-100 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              सभेचे वर्ष
            </div>
            <div className="text-base font-bold text-gray-800">
              वर्ष २०२६ (फेब्रुवारी – ऑगस्ट)
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80 shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="सभेचा विषय किंवा निर्णय शोधा..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
            />
          </div>

          {/* Month Selector */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700">
              <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL">सर्व महिने (All Months)</option>
                {MARATHI_MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedMonth('ALL');
                }}
                className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 hover:underline font-bold text-xs px-2"
              >
                <RefreshCw className="w-3 h-3" />
                <span>फिल्टर काढा</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Meetings List */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-24 space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          <span className="text-xs text-gray-500 font-medium">सभेचे इतिवृत्त लोड होत आहे...</span>
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-gray-600 font-medium">कोणतीही सभेची नोंद आढळली नाही.</p>
          <p className="text-xs text-gray-400">कृपया शोध शब्द किंवा महिना फिल्टर बदलून पहा.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMeetings.map((meeting, idx) => (
            <div
              key={meeting.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100/80 shadow-sm space-y-6 hover:shadow-md transition"
            >
              {/* Meeting Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="bg-orange-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
                      सभा #{idx + 1}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                    {meeting.meetingTitleMarathi}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2 font-medium">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                      <span>
                        {new Date(meeting.meetingDate).toLocaleDateString('mr-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      <span>{meeting.location}</span>
                    </span>
                    {meeting.attendanceCount && (
                      <span className="flex items-center space-x-1 text-orange-700 font-bold bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
                        <Users className="w-3 h-3" />
                        <span>{meeting.attendanceCount} सभासद उपस्थित</span>
                      </span>
                    )}
                  </div>
                </div>

                {meeting.minutesFileUrl && (
                  <a
                    href={meeting.minutesFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold rounded-xl border border-orange-200 transition shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>इतिवृत्त PDF</span>
                  </a>
                )}
              </div>

              {/* Description if any */}
              {meeting.descriptionMarathi && (
                <div className="text-sm text-gray-600 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 leading-relaxed">
                  {meeting.descriptionMarathi}
                </div>
              )}

              {/* Agenda & Decisions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {meeting.agendaMarathi && (
                  <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 space-y-2.5">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
                      <span>सभेचा अजेंडा व प्रमुख विषय:</span>
                    </h3>
                    <p className="text-gray-800 text-xs sm:text-sm whitespace-pre-line leading-relaxed font-normal">
                      {meeting.agendaMarathi}
                    </p>
                  </div>
                )}

                {meeting.decisionsMarathi && (
                  <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 space-y-2.5">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>मंजूर केलेले ठराव व अंतिम निर्णय:</span>
                    </h3>
                    <p className="text-gray-800 text-xs sm:text-sm whitespace-pre-line leading-relaxed font-normal">
                      {meeting.decisionsMarathi}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
