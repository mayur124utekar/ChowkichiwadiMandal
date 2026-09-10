import React, { useEffect, useState } from 'react';
import { 
  Image as ImageIcon, 
  Instagram, 
  ExternalLink, 
  Play, 
  Sparkles, 
  Video, 
  Layers, 
  Heart,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { SiteSettings } from '../../types/index.js';

interface GalleryMediaItem {
  id: string;
  type: 'instagram_reel' | 'instagram_post' | 'photo';
  title: string;
  titleMarathi: string;
  descriptionMarathi: string;
  instagramUrl?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  tag?: string;
}

export const GalleryPage: React.FC = () => {
  const { settings } = useOutletContext<{ settings?: SiteSettings }>();
  const [activeTab, setActiveTab] = useState<'all' | 'reels' | 'photos'>('all');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const instagramHandle = 'adyatm_mandal_sakhar';
  const instagramProfileUrl = `https://www.instagram.com/${instagramHandle}/`;

  // Dynamically initialize Instagram embed script when component mounts
  useEffect(() => {
    // If window.instgrm exists, trigger process()
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    } else {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        if ((window as any).instgrm) {
          (window as any).instgrm.Embeds.process();
        }
      };
      document.body.appendChild(script);
    }
  }, [activeTab]);

  // Curated media showcase items from Instagram & Mandal activities
  const galleryItems: GalleryMediaItem[] = [
    {
      id: 'ig-1',
      type: 'instagram_reel',
      title: 'Shree Sai Baba Palkhi & Bhajan Utsav',
      titleMarathi: 'श्री साईबाबा पालखी सोहळा व भजन उत्सव',
      descriptionMarathi: 'चौकीचीवाडी ग्रामस्थांचा भक्तीमय पालखी सोहळा आणि कीर्तन-भजन.',
      instagramUrl: `https://www.instagram.com/${instagramHandle}/`,
      embedUrl: `https://www.instagram.com/${instagramHandle}/`,
      tag: 'पालखी सोहळा'
    },
    {
      id: 'ig-2',
      type: 'instagram_reel',
      title: 'Shree Ganeshotsav Celebrations & Aarti',
      titleMarathi: 'श्री गणेशोत्सव मंडप प्रतिष्ठापना व महाआरती',
      descriptionMarathi: 'युवा मंडळ व सर्व ग्रामस्थांचा एकत्रित गणेशोत्सव आणि सांस्कृतिक कार्यक्रम.',
      instagramUrl: `https://www.instagram.com/${instagramHandle}/`,
      embedUrl: `https://www.instagram.com/${instagramHandle}/`,
      tag: 'गणेशोत्सव'
    },
    {
      id: 'ig-3',
      type: 'instagram_post',
      title: 'Chowkichiwadi Adhyatm Mandal Official Logo',
      titleMarathi: 'मंडळाचा अधिकृत लोगो व प्रतिष्ठापना',
      descriptionMarathi: 'श्री साईबाबा कृपाशीर्वाद व चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ - साखर.',
      instagramUrl: `https://www.instagram.com/${instagramHandle}/`,
      thumbnailUrl: settings?.logoUrl || '/logo.png',
      tag: 'लोगो'
    },
    {
      id: 'ig-4',
      type: 'instagram_reel',
      title: 'Gramastha Sabha & Social Activities',
      titleMarathi: 'ग्रामस्थ सभा, चर्चा व सामाजिक उपक्रम',
      descriptionMarathi: 'मंडळाच्या वार्षिक सभा, ठराव आणि गावाच्या विकासात्मक उपक्रमांची झलक.',
      instagramUrl: `https://www.instagram.com/${instagramHandle}/`,
      embedUrl: `https://www.instagram.com/${instagramHandle}/`,
      tag: 'सामाजिक उपक्रम'
    }
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'reels') return item.type === 'instagram_reel';
    if (activeTab === 'photos') return item.type === 'photo' || item.type === 'instagram_post';
    return true;
  });

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-amber-50/30 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Title Section */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border border-pink-200/60 text-pink-700 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">
            <Instagram className="w-4 h-4 text-pink-600" />
            <span>अधिकृत इन्स्टाग्राम व छायाचित्रे</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            उत्सव, रील्स व उपक्रम छायाचित्रे
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            चौकीचीवाडी ग्रामस्थ मंडळाच्या विविध धार्मिक उत्सव, श्री साईबाबा पालखी, गणेशोत्सव आणि सामाजिक उपक्रमांचे थेट इन्स्टाग्राम रील्स व फोटो.
          </p>
        </div>

        {/* Instagram Profile Featured Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 p-1 shadow-xl">
          <div className="relative rounded-[22px] bg-slate-900/90 backdrop-blur-xl text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5">
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 shadow-lg flex-shrink-0 animate-pulse">
                  <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden">
                    <img 
                      src={settings?.logoUrl || '/logo.png'} 
                      alt="Instagram Logo" 
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-1.5 text-white shadow-md">
                  <Instagram className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    @{instagramHandle}
                  </h2>
                  <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400" /> अधिकृत खाते
                  </span>
                </div>
                <p className="text-sm text-pink-200 font-medium">
                  {settings?.mandalNameMarathi || 'चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ - साखर'}
                </p>
                <p className="text-xs text-stone-300 max-w-lg">
                  मंडळाचे सर्व चालू उत्सव, थेट व्हिडिओ, पालखी सोहळा व उपक्रमांच्या नवीन रील्स दररोज पाहण्यासाठी आमच्या इन्स्टाग्राम खात्याला फॉलो करा.
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <a
                href={instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 via-purple-600 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-pink-500/30 transition transform hover:-translate-y-0.5 text-sm"
              >
                <Instagram className="w-4 h-4" />
                <span>Follow on Instagram</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
              </a>

              <a
                href={`instagram://user?username=${instagramHandle}`}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-2xl border border-white/20 transition text-xs"
              >
                <span>Open in App</span>
              </a>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-gray-200 shadow-sm gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'all'
                  ? 'bg-orange-500 text-white shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>सर्व (All)</span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'reels'
                  ? 'bg-pink-600 text-white shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
              }`}
            >
              <Video className="w-4 h-4 text-pink-400" />
              <span>इन्स्टाग्राम रील्स (Reels)</span>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'photos'
                  ? 'bg-orange-500 text-white shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-amber-500" />
              <span>छायाचित्रे (Photos)</span>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-orange-100/80 shadow-md hover:shadow-xl transition duration-300 flex flex-col group"
            >
              {/* Card Media Preview Area */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-900 to-stone-900 overflow-hidden flex items-center justify-center">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.titleMarathi}
                    className="w-full h-full object-contain p-6 group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative">
                    {/* Decorative background glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-purple-900/40 to-black/80 opacity-90"></div>
                    
                    <div className="relative z-10 flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 p-0.5 shadow-lg group-hover:scale-110 transition duration-300">
                        <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center">
                          {item.type === 'instagram_reel' ? (
                            <Play className="w-7 h-7 text-white fill-white ml-1" />
                          ) : (
                            <Instagram className="w-7 h-7 text-pink-400" />
                          )}
                        </div>
                      </div>

                      <span className="text-xs font-semibold text-pink-200 tracking-wider uppercase bg-pink-500/20 px-3 py-1 rounded-full border border-pink-400/30">
                        {item.tag || 'Instagram Media'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Top Badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/10">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>@{instagramHandle}</span>
                </div>

                {/* Direct External Link Icon */}
                {item.instagramUrl && (
                  <a
                    href={item.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-pink-300 hover:bg-black/80 transition"
                    title="Open on Instagram"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-orange-600 transition">
                    {item.titleMarathi}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {item.descriptionMarathi}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <a
                    href={item.instagramUrl || instagramProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-3 py-2 rounded-xl transition"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>इन्स्टाग्रामवर पहा</span>
                  </a>

                  <button
                    onClick={() => copyToClipboard(item.instagramUrl || instagramProfileUrl, item.id)}
                    className="inline-flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition"
                    title="Copy Link"
                  >
                    {copiedLink === item.id ? (
                      <span className="text-green-600 font-medium text-[11px]">कॉपी केले!</span>
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action for Instagram Community */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              आमच्याशी इन्स्टाग्रामवर जोडले जा!
            </h3>
            <p className="text-amber-100 text-sm sm:text-base">
              मंडळाचे सर्व आगामी कार्यक्रम, पालखी सोहळा लाईव्ह व्हिडिओ व उत्सवाचे क्षण थेट पाहण्यासाठी आत्ताच फॉलो करा.
            </p>
          </div>

          <a
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-white text-orange-600 hover:bg-orange-50 font-bold px-7 py-3.5 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 text-sm sm:text-base flex-shrink-0"
          >
            <Instagram className="w-5 h-5 text-pink-600" />
            <span>@adyatm_mandal_sakhar फॉलो करा</span>
          </a>
        </div>
      </div>
    </div>
  );
};

