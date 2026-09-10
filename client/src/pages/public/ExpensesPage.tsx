import React, { useEffect, useState, useMemo } from 'react';
import { FileText, Tag, Search, Filter, Calendar, ArrowUpDown, Receipt, TrendingDown, RefreshCw } from 'lucide-react';
import { PublicAPI } from '../../api/client.js';
import { Expense } from '../../types/index.js';

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

export const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    // Fetch all records with large limit
    PublicAPI.getExpenses(1000)
      .then((data) => setExpenses(data || []))
      .catch((err) => console.error('Failed to load expenses:', err))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number | string) => {
    const num = Number(val || 0);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  // Categories list
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    expenses.forEach((exp) => {
      if (exp.category) {
        map.set(String(exp.category.id), exp.category.nameMarathi || exp.category.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [expenses]);

  // Available Years
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    expenses.forEach((exp) => {
      if (exp.expenseDate) {
        const y = new Date(exp.expenseDate).getFullYear().toString();
        years.add(y);
      }
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [expenses]);

  // Filtered & Sorted Expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((exp) => {
        // Search filter
        const matchSearch =
          searchTerm.trim() === '' ||
          (exp.titleMarathi && exp.titleMarathi.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (exp.title && exp.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (exp.category?.nameMarathi && exp.category.nameMarathi.toLowerCase().includes(searchTerm.toLowerCase()));

        // Category filter
        const matchCategory =
          selectedCategory === 'ALL' ||
          (exp.category && String(exp.category.id) === selectedCategory);

        // Date extraction
        const expDate = exp.expenseDate ? new Date(exp.expenseDate) : null;
        const expYear = expDate ? expDate.getFullYear().toString() : '';
        const expMonth = expDate ? (expDate.getMonth() + 1).toString() : '';

        // Year filter
        const matchYear = selectedYear === 'ALL' || expYear === selectedYear;

        // Month filter
        const matchMonth = selectedMonth === 'ALL' || expMonth === selectedMonth;

        return matchSearch && matchCategory && matchYear && matchMonth;
      })
      .sort((a, b) => {
        const timeA = new Date(a.expenseDate).getTime();
        const timeB = new Date(b.expenseDate).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [expenses, searchTerm, selectedCategory, selectedYear, selectedMonth, sortOrder]);

  const totalExpenseAmount = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  }, [expenses]);

  const filteredExpenseAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  }, [filteredExpenses]);

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'ALL' || selectedYear !== 'ALL' || selectedMonth !== 'ALL';

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedYear('ALL');
    setSelectedMonth('ALL');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide">
          <FileText className="w-4 h-4 text-orange-600" />
          <span>पारदर्शक खर्च नोंद</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          मंडळ खर्च व हिशोब सूची
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          विविध उत्सव, धार्मिक साहित्य, महाप्रसाद, रंगकाम व मंदिर परिसर देखभाल यांसाठी करण्यात आलेल्या सर्व अधिकृत खर्चाचा संपूर्ण तपशील.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-orange-50/50 p-5 rounded-2xl border border-red-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-200 shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {hasActiveFilters ? 'निवडलेला खर्च (Filtered)' : 'एकूण खर्च (Total Expenses)'}
            </div>
            <div className="text-2xl font-black text-red-600 tracking-tight">
              {formatCurrency(hasActiveFilters ? filteredExpenseAmount : totalExpenseAmount)}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-100 shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {hasActiveFilters ? 'निवडलेल्या नोंदी' : 'एकूण नोंदवलेले खर्च'}
            </div>
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {hasActiveFilters ? filteredExpenses.length : expenses.length}{' '}
              <span className="text-sm font-medium text-gray-500">नोंदी</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-100 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              कालावधी (Timeline)
            </div>
            <div className="text-base font-bold text-gray-800">
              वर्ष २०२५ – २०२६
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="खर्च शोधा (Search description)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Year Selector */}
            <div className="flex items-center space-x-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-gray-700">
              <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL">सर्व वर्षे (All Years)</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    वर्ष {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Selector */}
            <div className="flex items-center space-x-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-gray-700">
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

            {/* Category Selector */}
            <div className="flex items-center space-x-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-gray-700">
              <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer pr-1 max-w-[170px] truncate"
              >
                <option value="ALL">सर्व वर्गवारी (All Categories)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="flex items-center space-x-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 rounded-xl px-3 py-1.5 text-xs font-semibold transition"
              title="तारखेनुसार क्रम बदला"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortOrder === 'desc' ? 'नवीनतम आधी' : 'जुने आधी'}</span>
            </button>
          </div>
        </div>

        {/* Filter Summary indicator */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs text-gray-600 bg-orange-50/60 px-3 py-2 rounded-lg border border-orange-100">
            <span>
              शोध निकाल: <strong>{filteredExpenses.length}</strong> नोंदी आढळल्या (रक्कम: <strong>{formatCurrency(filteredExpenseAmount)}</strong>)
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 hover:underline font-bold"
            >
              <RefreshCw className="w-3 h-3" />
              <span>फिल्टर काढा (Reset)</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Expenses Table / Content */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-24 space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          <span className="text-xs text-gray-500 font-medium">खर्च तपशील लोड होत आहेत...</span>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-gray-600 font-medium">कोणतीही नोंद आढळली नाही.</p>
          <p className="text-xs text-gray-400">कृपया शोध शब्द किंवा वर्ष / महिना फिल्टर बदलून पहा.</p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="mt-2 inline-flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>सर्व खर्च दाखवा (Clear Filters)</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
          {/* Mobile Card List (< 768px) */}
          <div className="block md:hidden divide-y divide-gray-100">
            {filteredExpenses.map((exp, idx) => (
              <div key={exp.id} className="p-4 space-y-2 hover:bg-orange-50/20 transition">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-start space-x-2.5">
                    <span className="text-xs font-bold text-gray-400 mt-0.5">#{idx + 1}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">
                        {exp.titleMarathi || exp.title}
                      </h3>
                      <div className="inline-flex items-center space-x-1 text-[11px] text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full mt-1 font-medium border border-orange-100">
                        <Tag className="w-3 h-3" />
                        <span>{exp.category?.nameMarathi || exp.category?.name || 'इतर'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-red-600 text-base">{formatCurrency(exp.amount)}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5 font-medium">
                      {new Date(exp.expenseDate).toLocaleDateString('mr-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
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
                <tr className="bg-orange-50/80 border-b border-orange-100 text-xs font-bold text-orange-950 uppercase tracking-wider">
                  <th className="py-4 px-5 text-center w-14">क्र.</th>
                  <th className="py-4 px-6 w-36">दिनांक (Date)</th>
                  <th className="py-4 px-6">खर्चाचे कारण व तपशील (Expense Description)</th>
                  <th className="py-4 px-6 w-56">वर्गवारी (Category)</th>
                  <th className="py-4 px-6 text-right w-40">रक्कम (Amount)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredExpenses.map((exp, idx) => (
                  <tr key={exp.id} className="hover:bg-orange-50/40 transition">
                    <td className="py-4 px-5 text-center text-xs font-semibold text-gray-400">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-medium whitespace-nowrap text-xs">
                      {new Date(exp.expenseDate).toLocaleDateString('mr-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-900">
                      {exp.titleMarathi || exp.title}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-orange-50 text-orange-800 border border-orange-200/60 text-xs px-2.5 py-1 rounded-full font-medium inline-block">
                        {exp.category?.nameMarathi || exp.category?.name || 'इतर'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-black text-red-600 text-base">
                      {formatCurrency(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-orange-100/50 border-t-2 border-orange-200 text-sm font-extrabold text-gray-900">
                  <td colSpan={4} className="py-4 px-6 text-right uppercase tracking-wider">
                    {hasActiveFilters
                      ? `निवडलेला एकूण खर्च (${filteredExpenses.length} नोंदी):`
                      : `सर्व एकूण खर्च (${expenses.length} नोंदी):`}
                  </td>
                  <td className="py-4 px-6 text-right text-red-700 text-lg font-black">
                    {formatCurrency(filteredExpenseAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
