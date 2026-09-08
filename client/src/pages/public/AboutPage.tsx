import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShieldCheck, Target, Heart, CheckCircle2, Award, Users } from 'lucide-react';
import { SiteSettings } from '../../types/index.js';

export const AboutPage: React.FC = () => {
  const { settings } = useOutletContext<{ settings?: SiteSettings }>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3.5 py-1 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-orange-600" />
          <span>मंडळाची ओळख व उद्दिष्टे</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          {settings?.mandalNameMarathi || 'चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ'}
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          {settings?.addressMarathi || 'साखर चौकीचीवाडी, ता. खेड, जि. रत्नागिरी'}
        </p>
      </div>

      {/* Intro Grid */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-orange-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-orange-500 p-1 shadow-lg bg-white">
            <img src={settings?.logoUrl || '/logo.png'} alt="Logo" className="w-full h-full object-contain rounded-full" />
          </div>
        </div>
        <div className="lg:col-span-8 space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-gray-900">मंडळाची स्थापना व संकल्पना</h2>
          <p>
            गावातील सामाजिक ऐक्य, धार्मिक परंपरांचे जतन आणि ग्रामविकासाला गती देण्यासाठी <strong>चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ</strong> स्थापन करण्यात आले. मंडळाचे कामकाज शासकीय नियमांनुसार नोंदणीकृत असून (नोंदणी क्र. {settings?.regNumberMarathi || 'महाराष्ट्र/०१३/२०२०/रत्ना.'}) गावातील ज्येष्ठ मार्गदर्शक व युवा पिढीच्या संयुक्त प्रयत्नातून चालवले जाते.
          </p>
          <p>
            गावातील सर्व ग्रामस्थांना एकत्र आणून विविध सामाजिक, सांस्कृतिक व धार्मिक उपक्रम राबवणे हे आमचे ध्येय आहे. मंडळाच्या कामकाजात पूर्ण पारदर्शकता ठेवण्यासाठी डिजिटल प्रणालीचा वापर करण्यात येत आहे.
          </p>
        </div>
      </div>

      {/* Objectives & Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">प्रमुख उद्दिष्टे</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span>गावातील धार्मिक उत्सव व परंपरांचे यशस्वी आयोजन.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span>मंदिर व सार्वजनिक वास्तूंची देखभाल व स्वच्छता.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span>गावातील युवकांना सामाजिक कार्यात प्रोत्साहन.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">गट रचना</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span><strong>सामान्य ग्रुप:</strong> ज्येष्ठ व मार्गदर्शक ग्रामस्थ सदस्य.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span><strong>युवा ग्रुप:</strong> उत्साही व सामाजिक कार्यात तत्पर युवक गट.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>दोन्ही गटांचा संयुक्त समन्वय व निर्णय प्रक्रिया.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">पारदर्शकता व नियम</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>दरमहा नियमित ₹{settings?.monthlyTargetAmount || 200}/- वर्गणी संकलन.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>प्रत्येक जमा व खर्चाची रीतसर पावती व लेखापरीक्षण.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>वार्षिक सर्वसाधारण सभेत हिशोबाचे जाहीर सादरीकरण.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
