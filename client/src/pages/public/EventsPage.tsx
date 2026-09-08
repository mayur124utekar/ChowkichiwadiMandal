import React, { useEffect, useState } from 'react';
import { Calendar, Users, Award, Tag } from 'lucide-react';
import { PublicAPI } from '../../api/client.js';
import { Event } from '../../types/index.js';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PublicAPI.getEvents()
      .then((data) => setEvents(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number | string) => {
    const num = Number(val || 0);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-full font-semibold">आगामी उत्सव</span>;
      case 'ONGOING':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">चालू कार्यक्रम</span>;
      case 'COMPLETED':
        return <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-semibold">संपन्न उत्सव</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3.5 py-1 rounded-full text-xs font-semibold">
          <Calendar className="w-4 h-4 text-orange-600" />
          <span>धार्मिक व सामाजिक सण</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          उत्सव वर्गणी व कार्यक्रम
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          श्री गणेशोत्सव, श्री साईबाबा पालखी सोहळा, नवरात्र व इतर धार्मिक उत्सवांची माहिती व संकलन.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">कोणतेही उत्सव किंवा कार्यक्रम नोंदवले नाहीत.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center space-x-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>वर्ष {ev.year}</span>
                  </span>
                  {getStatusBadge(ev.status)}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                  {ev.nameMarathi}
                </h2>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {ev.descriptionMarathi || 'उत्सवाचा सविस्तर कार्यक्रम व पूजा विधी.'}
                </p>

                <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-100 text-xs space-y-2">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>उत्सव दिनांक:</span>
                    <strong className="text-gray-900">
                      {new Date(ev.eventDate).toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </strong>
                  </div>

                  {ev.targetAmount && (
                    <div className="flex justify-between items-center text-gray-700">
                      <span>अपेक्षित उद्दिष्ट:</span>
                      <strong className="text-gray-900">{formatCurrency(ev.targetAmount)}</strong>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-emerald-800 font-semibold border-t border-orange-200/60 pt-2">
                    <span>एकूण जमा वर्गणी:</span>
                    <strong className="text-base text-emerald-700">{formatCurrency(ev.totalCollected || 0)}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span>{ev.contributorsCount || 0} देणगीदार / सभासद</span>
                </span>
                <span className="text-orange-600 font-semibold">चौकीचीवाडी ग्रामस्थ मंडळ</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
