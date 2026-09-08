import React, { useEffect, useState } from 'react';
import { TrendingUp, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PublicAPI } from '../../api/client.js';

export const MonthlyPage: React.FC = () => {
  const [finance, setFinance] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const months = [
    { num: 1, name: 'जानेवारी' },
    { num: 2, name: 'फेब्रुवारी' },
    { num: 3, name: 'मार्च' },
    { num: 4, name: 'एप्रिल' },
    { num: 5, name: 'मे' },
    { num: 6, name: 'जून' },
    { num: 7, name: 'जुलै' },
    { num: 8, name: 'ऑगस्ट' },
    { num: 9, name: 'सप्टेंबर' },
    { num: 10, name: 'ऑक्टोबर' },
    { num: 11, name: 'नोव्हेंबर' },
    { num: 12, name: 'डिसेंबर' },
  ];

  useEffect(() => {
    setLoading(true);
    PublicAPI.getFinancialSummary(selectedYear, selectedMonth)
      .then((data) => setFinance(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedYear, selectedMonth]);

  const formatCurrency = (val: number | string) => {
    const num = Number(val || 0);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3.5 py-1 rounded-full text-xs font-semibold">
          <TrendingUp className="w-4 h-4 text-orange-600" />
          <span>पारदर्शक जमा-खर्च व्यवस्था</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          मासिक वर्गणी व आर्थिक माहिती
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          प्रत्येक सभासदाची दरमहा नियमित ₹२००/- मासिक वर्गणी व मंडळाचा एकूण आर्थिक गोषवारा.
        </p>
      </div>

      {/* Month Filter Selector */}
      <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-orange-600" />
          <span className="text-sm font-bold text-gray-800">महिना निवडा:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {months.map((m) => (
            <button
              key={m.num}
              onClick={() => setSelectedMonth(m.num)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedMonth === m.num
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : finance?.isHidden ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <ShieldCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-base font-medium">आर्थिक गोषवारा सध्या प्रशासकीय नियमानुसार मर्यादित आहे.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Selected Month Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-orange-100 font-bold">मासिक संकलन आढावा</span>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {months.find((m) => m.num === selectedMonth)?.name} {selectedYear} वर्गणी
                </h2>
                <p className="text-orange-100 text-sm">
                  या महिन्यातील जमा झालेली एकूण वर्गणी व निधी.
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center">
                <div className="text-xs uppercase tracking-wider text-orange-100">या महिन्याची एकूण जमा</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  {formatCurrency(finance?.monthlyCollected || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Overall Finances Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">एकूण जमा (वार्षिक उत्पन्न)</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
                {formatCurrency(finance?.totalIncome || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">मासिक वर्गणी + उत्सव वर्गणी + इतर देणग्या</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">एकूण खर्च (वार्षिक)</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-2">
                {formatCurrency(finance?.totalExpenses || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">धार्मिक उत्सव, साहित्य, मंदिर देखभाल व इतर खर्च</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">मंडळ निव्वळ शिल्लक निधी</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 mt-2">
                {formatCurrency(finance?.totalBalance || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">सुरुवातीची शिल्लक + एकूण जमा - एकूण खर्च</p>
            </div>
          </div>

          {/* Information Notice */}
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 text-sm text-amber-900 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">नोंद व नियम:</p>
              <p>
                सभासदांच्या वैयक्तिक गोपनीयतेचे रक्षण करण्यासाठी केवळ एकूण जमा रकमेचा गोषवारा सार्वजनिकरित्या दर्शवला जातो. तपशीलवार पावती व सदस्यनिहाय स्थिती पाहण्यासाठी कार्यकारिणी पदाधिकाऱ्यांशी संपर्क साधावा.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
