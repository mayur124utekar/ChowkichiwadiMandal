import React, { useEffect, useState } from 'react';
import { FileText, ShieldCheck, Tag } from 'lucide-react';
import { PublicAPI } from '../../api/client.js';
import { Expense } from '../../types/index.js';

export const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PublicAPI.getExpenses()
      .then((data) => setExpenses(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number | string) => {
    const num = Number(val || 0);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3.5 py-1 rounded-full text-xs font-semibold">
          <FileText className="w-4 h-4 text-orange-600" />
          <span>पारदर्शक खर्च नोंद</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          मंडळ खर्च व हिशोब सूची
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          विविध उत्सव, धार्मिक साहित्य, महाप्रसाद व देखभाल यांसाठी करण्यात आलेल्या अधिकृत खर्चाची यादी.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">सार्वजनिक खर्चाच्या नोंदी उपलब्ध नाहीत.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
          {/* Mobile Card List (< 768px) */}
          <div className="block md:hidden divide-y divide-gray-100">
            {expenses.map((exp) => (
              <div key={exp.id} className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{exp.titleMarathi || exp.title}</h3>
                    <div className="inline-flex items-center space-x-1 text-[11px] text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full mt-1">
                      <Tag className="w-3 h-3" />
                      <span>{exp.category?.nameMarathi || 'सामान्य'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-red-600 text-base">{formatCurrency(exp.amount)}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {new Date(exp.expenseDate).toLocaleDateString('mr-IN')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-50/70 border-b border-orange-100 text-xs font-bold text-orange-950 uppercase tracking-wider">
                  <th className="py-4 px-6">दिनांक</th>
                  <th className="py-4 px-6">खर्चाचे कारण व तपशील</th>
                  <th className="py-4 px-6">वर्गवारी (Category)</th>
                  <th className="py-4 px-6 text-right">रक्कम (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-orange-50/30 transition">
                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">
                      {new Date(exp.expenseDate).toLocaleDateString('mr-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-800">
                      {exp.titleMarathi || exp.title}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-orange-100/70 text-orange-800 text-xs px-2.5 py-1 rounded-full font-medium">
                        {exp.category?.nameMarathi || 'इतर'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-red-600">
                      {formatCurrency(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
