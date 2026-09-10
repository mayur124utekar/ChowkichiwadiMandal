import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Phone, Mail, ShieldCheck, Instagram } from 'lucide-react';
import { SiteSettings } from '../../types/index.js';

interface Props {
  settings?: SiteSettings | null;
}

export const PublicFooter: React.FC<Props> = ({ settings }) => {
  return (
    <footer className="bg-gradient-to-b from-stone-900 to-black text-white pt-14 pb-8 border-t-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Mandal Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border border-orange-400">
                <img src={settings?.logoUrl || '/logo.png'} alt="Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <h3 className="font-bold text-base text-orange-400">चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ</h3>
                <p className="text-xs text-stone-300">साखर चौकीचीवाडी (युवा मंडळ)</p>
              </div>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed">
              ग्रामविकास, अध्यात्मिक प्रबोधन, सामाजिक एकता आणि पारदर्शक व्यवस्थापनाचे आमचे ध्येय.
            </p>
            <div className="bg-stone-800/80 p-3 rounded-lg border border-stone-700/60 text-xs text-orange-300 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span>{settings?.regNumberMarathi || 'रजि. क्र.: महाराष्ट्र/०१३/२०२०/रत्ना.'}</span>
            </div>
            <a
              href="https://www.instagram.com/adyatm_mandal_sakhar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 hover:opacity-90 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-md"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram: @adyatm_mandal_sakhar</span>
            </a>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-orange-400 tracking-wider uppercase mb-4">महत्वाच्या लिंक्स</h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link to="/about" className="hover:text-orange-400 transition flex items-center space-x-1.5">
                  <span>›</span> <span>मंडळाची माहिती व उद्दिष्टे</span>
                </Link>
              </li>
              <li>
                <Link to="/members" className="hover:text-orange-400 transition flex items-center space-x-1.5">
                  <span>›</span> <span>सामान्य व युवा कार्यकारिणी सदस्य</span>
                </Link>
              </li>
              <li>
                <Link to="/monthly-contributions" className="hover:text-orange-400 transition flex items-center space-x-1.5">
                  <span>›</span> <span>मासिक वर्गणी तपशील</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-orange-400 transition flex items-center space-x-1.5">
                  <span>›</span> <span>उत्सव व कार्यक्रम</span>
                </Link>
              </li>
              <li>
                <Link to="/expenses" className="hover:text-orange-400 transition flex items-center space-x-1.5">
                  <span>›</span> <span>खर्च व हिशोब पारदर्शकता</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Meetings & Records */}
          <div>
            <h4 className="text-sm font-semibold text-orange-400 tracking-wider uppercase mb-4">नोंदी व अहवाल</h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link to="/meetings" className="hover:text-orange-400 transition flex items-center space-x-1.5">
                  <span>›</span> <span>मागील सभा व निर्णय</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-orange-400 transition flex items-center space-x-1.5">
                  <span>›</span> <span>छायाचित्रे व उत्सव आठवणी</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition flex items-center space-x-1.5">
                  <span>›</span> <span>मदत व देणगी संपर्क</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-orange-400 transition flex items-center space-x-1.5 text-orange-300 font-medium">
                  <span>›</span> <span>प्रशासक लॉगिन (Admin Panel)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact details */}
          <div>
            <h4 className="text-sm font-semibold text-orange-400 tracking-wider uppercase mb-4">संपर्क व पत्ता</h4>
            <ul className="space-y-3 text-sm text-stone-300">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <span>{settings?.addressMarathi || 'साखर चौकीचीवाडी, ता. खेड, जि. रत्नागिरी'}</span>
              </li>
              {settings?.primaryPhone && (
                <li className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <a href={`tel:${settings.primaryPhone}`} className="hover:text-orange-400 transition">
                    +91 {settings.primaryPhone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-orange-400 transition">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-stone-800 text-center text-xs text-stone-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} {settings?.mandalNameMarathi || 'चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ'}. सर्व हक्क राखीव.</p>
          <p className="text-amber-400 font-medium">
            संकल्पना :- सागर रेवणे व मयूर उतेकर
          </p>
          <p className="flex items-center space-x-1">
            <span>श्रद्धा आणि सबुरी • श्री साईबाबा प्रसन्न</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
