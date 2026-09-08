import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '../../types/index.js';

export const ContactPage: React.FC = () => {
  const { settings } = useOutletContext<{ settings?: SiteSettings }>();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3.5 py-1 rounded-full text-xs font-semibold">
          <Phone className="w-4 h-4 text-orange-600" />
          <span>संपर्क व मार्गदर्शन</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          मंडळाशी संपर्क साधा
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          देणगी, वर्गणी, सूचना किंवा इतर चौकशीसाठी आमच्या कार्यकारिणी पदाधिकाऱ्यांशी संपर्क साधावा.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              अधिकृत संपर्क माहिती
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">पत्ता / ठिकाण:</h3>
                  <p className="text-gray-600 text-sm mt-0.5">
                    {settings?.addressMarathi || 'साखर चौकीचीवाडी, ता. खेड, जि. रत्नागिरी'}
                  </p>
                </div>
              </div>

              {settings?.primaryPhone && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">संपर्क क्रमांक:</h3>
                    <p className="text-gray-600 text-sm mt-0.5 font-medium">
                      +91 {settings.primaryPhone} {settings.secondaryPhone ? ` / ${settings.secondaryPhone}` : ''}
                    </p>
                  </div>
                </div>
              )}

              {settings?.email && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">ईमेल:</h3>
                    <p className="text-gray-600 text-sm mt-0.5">
                      {settings.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">नोंदणी क्रमांक:</h3>
                  <p className="text-gray-600 text-sm mt-0.5 font-semibold text-orange-700">
                    {settings?.regNumberMarathi || 'महाराष्ट्र/०१३/२०२०/रत्ना.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message / Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-orange-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">संदेश पाठवा / सूचना</h2>
            <p className="text-sm text-gray-500 mb-6">मंडळाच्या उपक्रमांविषयी किंवा देणगीबद्दल काही प्रश्न असल्यास येथे संदेश पाठवा.</p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-lg">आपला संदेश यशस्वीरीत्या नोंदवला गेला आहे!</h3>
                <p className="text-sm">आमचे पदाधिकारी लवकरच आपल्याशी संपर्क साधतील. धन्यवाद.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    आपले पूर्ण नाव *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. श्री. रमेश कदम"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    मोबाईल क्रमांक *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="उदा. 9822000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    आपला संदेश / सूचना *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="येथे संदेश लिहा..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>संदेश पाठवा</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
