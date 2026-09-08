import React from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { SiteSettings } from '../../types/index.js';

export const GalleryPage: React.FC = () => {
  const { settings } = useOutletContext<{ settings?: SiteSettings }>();

  const galleryItems = [
    {
      title: 'मंडळाचा अधिकृत लोगो व प्रतिष्ठापना',
      desc: 'श्री साईबाबा कृपाशीर्वाद',
      url: settings?.logoUrl || '/logo.jpeg',
    },
    {
      title: 'श्री साईबाबा पालखी सोहळा व महाप्रसाद',
      desc: 'ग्रामस्थ महाप्रसाद व भजन सोहळा',
      url: settings?.logoUrl || '/logo.jpeg',
    },
    {
      title: 'श्री गणेशोत्सव मंडप व आरती',
      desc: 'युवा ग्रुप व ग्रामस्थ गणेशोत्सव',
      url: settings?.logoUrl || '/logo.jpeg',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3.5 py-1 rounded-full text-xs font-semibold">
          <ImageIcon className="w-4 h-4 text-orange-600" />
          <span>छायाचित्रे व आठवणी</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          उत्सव व उपक्रम छायाचित्रे
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          चौकीचीवाडी ग्रामस्थ मंडळाच्या विविध धार्मिक उत्सव, सामाजिक उपक्रम आणि सभांची निवडक छायाचित्रे.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {galleryItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-lg transition group flex flex-col"
          >
            <div className="aspect-square bg-orange-50/50 p-6 flex items-center justify-center overflow-hidden">
              <img
                src={item.url}
                alt={item.title}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-5 space-y-1 bg-white border-t border-gray-100 flex-grow">
              <h3 className="font-bold text-gray-900 text-base group-hover:text-orange-600 transition">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
