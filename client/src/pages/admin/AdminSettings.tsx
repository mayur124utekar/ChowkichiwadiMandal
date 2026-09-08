import React, { useEffect, useState } from 'react';
import { Settings, Save, AlertCircle, CheckCircle2, Upload, Shield } from 'lucide-react';
import { SettingsAPI } from '../../api/client.js';
import { SiteSettings } from '../../types/index.js';
import { ImageCropModal } from '../../components/ImageCropModal.js';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    mandalName: '',
    mandalNameMarathi: '',
    regNumber: '',
    regNumberMarathi: '',
    address: '',
    addressMarathi: '',
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    primaryColor: '#F97316',
    monthlyTargetAmount: 200,
    openingBalance: 0,
    showMonthlySummaryPublicly: true,
    showFestivalSummaryPublicly: true,
    showExpenseListPublicly: true,
    showMemberNamesPublicly: true,
    showContributorNamesPublicly: false,
  });

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    SettingsAPI.get()
      .then((data) => {
        setSettings(data);
        setFormData({
          mandalName: data.mandalName || '',
          mandalNameMarathi: data.mandalNameMarathi || '',
          regNumber: data.regNumber || '',
          regNumberMarathi: data.regNumberMarathi || '',
          address: data.address || '',
          addressMarathi: data.addressMarathi || '',
          primaryPhone: data.primaryPhone || '',
          secondaryPhone: data.secondaryPhone || '',
          email: data.email || '',
          primaryColor: data.primaryColor || '#F97316',
          monthlyTargetAmount: Number(data.monthlyTargetAmount || 200),
          openingBalance: Number(data.openingBalance || 0),
          showMonthlySummaryPublicly: Boolean(data.showMonthlySummaryPublicly),
          showFestivalSummaryPublicly: Boolean(data.showFestivalSummaryPublicly),
          showExpenseListPublicly: Boolean(data.showExpenseListPublicly),
          showMemberNamesPublicly: Boolean(data.showMemberNamesPublicly),
          showContributorNamesPublicly: Boolean(data.showContributorNamesPublicly),
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, String(val));
      });

      if (logoFile) {
        data.append('logo', logoFile);
      }

      const updated = await SettingsAPI.update(data);
      setSettings(updated);
      setStatusMsg({ type: 'success', text: 'Site settings updated successfully!' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Website & Mandal Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Customize registration numbers, monthly fee target, opening balance, and public visibility</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-2xl text-xs flex items-center space-x-2 border ${
          statusMsg.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Mandal Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Mandal Identity & Branding
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mandal Name (मराठीत) *</label>
              <input
                type="text"
                required
                value={formData.mandalNameMarathi}
                onChange={(e) => setFormData({ ...formData, mandalNameMarathi: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mandal Name (English) *</label>
              <input
                type="text"
                required
                value={formData.mandalName}
                onChange={(e) => setFormData({ ...formData, mandalName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Registration No. (मराठीत) *</label>
              <input
                type="text"
                required
                value={formData.regNumberMarathi}
                onChange={(e) => setFormData({ ...formData, regNumberMarathi: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Registration No. (English) *</label>
              <input
                type="text"
                required
                value={formData.regNumber}
                onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Address (मराठीत) *</label>
              <input
                type="text"
                required
                value={formData.addressMarathi}
                onChange={(e) => setFormData({ ...formData, addressMarathi: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Address (English)</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Phone</label>
              <input
                type="tel"
                value={formData.primaryPhone}
                onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Secondary Phone</label>
              <input
                type="tel"
                value={formData.secondaryPhone}
                onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Logo Upload Preview */}
          <div className="pt-2">
            <label className="block font-bold text-slate-700 mb-1">Mandal Logo Upload (मंडळ लोगो)</label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 p-0.5 bg-white flex-shrink-0 flex items-center justify-center">
                <img src={logoPreview || settings?.logoUrl || '/logo.jpeg'} alt="Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setCropImageSrc(reader.result as string);
                        setIsCropModalOpen(true);
                      };
                      reader.readAsDataURL(file);
                      e.target.value = '';
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  लोगो निवडल्यावर आपोआप <strong>क्रॉप व कॉम्प्रेस (WebP)</strong> विंडो उघडेल.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Configuration */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Financial & Accounting Configuration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Standard Monthly Contribution Target (₹ / Member) *
              </label>
              <input
                type="number"
                required
                value={formData.monthlyTargetAmount}
                onChange={(e) => setFormData({ ...formData, monthlyTargetAmount: parseFloat(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-emerald-700"
              />
              <p className="text-[11px] text-slate-400 mt-1">Default is ₹200.00</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Ledger Opening Balance (₹) *
              </label>
              <input
                type="number"
                required
                value={formData.openingBalance}
                onChange={(e) => setFormData({ ...formData, openingBalance: parseFloat(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-1">Starting balance carried forward</p>
            </div>
          </div>
        </div>

        {/* Public Transparency Toggles */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Public Website Transparency Controls
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">Show Monthly Financial Summary</span>
                <span className="text-[11px] text-slate-500">Display monthly collection totals on public website</span>
              </div>
              <input
                type="checkbox"
                checked={formData.showMonthlySummaryPublicly}
                onChange={(e) => setFormData({ ...formData, showMonthlySummaryPublicly: e.target.checked })}
                className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">Show Festival Collections Summary</span>
                <span className="text-[11px] text-slate-500">Display festival collection amounts on public website</span>
              </div>
              <input
                type="checkbox"
                checked={formData.showFestivalSummaryPublicly}
                onChange={(e) => setFormData({ ...formData, showFestivalSummaryPublicly: e.target.checked })}
                className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">Show Public Expense List</span>
                <span className="text-[11px] text-slate-500">Display approved expenses to public visitors</span>
              </div>
              <input
                type="checkbox"
                checked={formData.showExpenseListPublicly}
                onChange={(e) => setFormData({ ...formData, showExpenseListPublicly: e.target.checked })}
                className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">Show Member Names</span>
                <span className="text-[11px] text-slate-500">Show committee member photo cards on public portal</span>
              </div>
              <input
                type="checkbox"
                checked={formData.showMemberNamesPublicly}
                onChange={(e) => setFormData({ ...formData, showMemberNamesPublicly: e.target.checked })}
                className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
              />
            </label>
          </div>
        </div>
      </form>

      {/* Image Crop & Optimize Modal for Logo */}
      {cropImageSrc && (
        <ImageCropModal
          isOpen={isCropModalOpen}
          imageSrc={cropImageSrc}
          aspectRatio={1}
          cropShape="round"
          title="मंडळ लोगो क्रॉप व ऑप्टिमाइझ करा"
          maxWidth={400}
          maxHeight={400}
          onClose={() => setIsCropModalOpen(false)}
          onCropComplete={(croppedFile, previewUrl) => {
            setLogoFile(croppedFile);
            setLogoPreview(previewUrl);
          }}
        />
      )}
    </div>
  );
};
