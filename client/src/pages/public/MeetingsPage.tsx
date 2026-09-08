import React, { useEffect, useState } from 'react';
import { FileText, Calendar, MapPin, Users, CheckCircle2, Download } from 'lucide-react';
import { PublicAPI } from '../../api/client.js';
import { Meeting } from '../../types/index.js';

export const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PublicAPI.getMeetings()
      .then((data) => setMeetings(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3.5 py-1 rounded-full text-xs font-semibold">
          <FileText className="w-4 h-4 text-orange-600" />
          <span>ग्रामस्थ सभा व इतिवृत्त</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          मागील सभा व महत्त्वाचे निर्णय
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          ग्रामस्थ बैठकांचे विषय, अजेंडा, उपस्थिती आणि मंजूर करण्यात आलेले महत्त्वपूर्ण ठराव.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">कोणत्याही सभेच्या नोंदी उपलब्ध नाहीत.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {meeting.meetingTitleMarathi}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                      <span>{new Date(meeting.meetingDate).toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      <span>{meeting.location}</span>
                    </span>
                    {meeting.attendanceCount && (
                      <span className="flex items-center space-x-1 text-orange-700 font-semibold bg-orange-50 px-2 py-0.5 rounded-full">
                        <Users className="w-3 h-3" />
                        <span>{meeting.attendanceCount} ग्रामस्थ उपस्थित</span>
                      </span>
                    )}
                  </div>
                </div>

                {meeting.minutesFileUrl && (
                  <a
                    href={meeting.minutesFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold rounded-xl border border-orange-200 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>इतिवृत्त PDF डाउनलोड</span>
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {meeting.agendaMarathi && (
                  <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-100 space-y-2">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-1.5">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span>सभेचा अजेंडा / विषय:</span>
                    </h3>
                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                      {meeting.agendaMarathi}
                    </p>
                  </div>
                )}

                {meeting.decisionsMarathi && (
                  <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 space-y-2">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>मंजूर केलेले ठराव व निर्णय:</span>
                    </h3>
                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
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
