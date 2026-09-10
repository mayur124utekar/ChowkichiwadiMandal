import React, { useState, useEffect, useCallback } from 'react';
import { 
  Image as ImageIcon, 
  Instagram, 
  ExternalLink, 
  Layers, 
  Share2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Sparkles,
  Maximize2,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { SiteSettings } from '../../types/index.js';

export interface GalleryPhotoItem {
  id: string;
  title: string;
  titleEn: string;
  descriptionMarathi: string;
  imageUrl: string;
  category: string;
  date: string;
}

export const GalleryPage: React.FC = () => {
  const { settings } = useOutletContext<{ settings?: SiteSettings }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedGeneral, setCopiedGeneral] = useState<boolean>(false);

  const instagramHandle = 'adyatm_mandal_sakhar';
  const instagramProfileUrl = `https://www.instagram.com/${instagramHandle}/`;

  // Curated photo items hosted permanently on Vercel Blob Storage
  const galleryPhotos: GalleryPhotoItem[] = [
    {
      id: 'photo-1',
      title: 'श्री साईबाबा पालखी सोहळा व मिरवणूक',
      titleEn: 'Shree Sai Baba Palkhi Sohala & Procession',
      descriptionMarathi: 'चौकीचीवाडी ग्रामस्थांचा भक्तीमय वातावरणात पार पडलेला श्री साईबाबा पालखी सोहळा व मिरवणूक.',
      imageUrl: 'https://6naqxz7ixq636nw8.public.blob.vercel-storage.com/gallery/whatsapp-image-2026-09-10-at-11-04-36-pm-1-.jpeg',
      category: 'पालखी सोहळा',
      date: '२०२६',
    },
    {
      id: 'photo-2',
      title: 'भजन, कीर्तन व अध्यात्मिक सत्संग',
      titleEn: 'Bhajan, Kirtan & Spiritual Gathering',
      descriptionMarathi: 'गावातील भजनी मंडळ व भाविकांचा एकत्रित भक्तीमय भजन व कीर्तन सोहळा.',
      imageUrl: 'https://6naqxz7ixq636nw8.public.blob.vercel-storage.com/gallery/whatsapp-image-2026-09-10-at-11-04-36-pm-ds.jpeg',
      category: 'भजन व आरती',
      date: '२०२६',
    },
    {
      id: 'photo-3',
      title: 'श्री गणेशोत्सव मंडप प्रतिष्ठापना व आरती',
      titleEn: 'Shree Ganeshotsav Celebrations & Aarti',
      descriptionMarathi: 'वार्षिक गणेशोत्सवातील बाप्पाची मनमोहक मूर्ती, मंडप सजावट व महाआरती सोहळा.',
      imageUrl: 'https://6naqxz7ixq636nw8.public.blob.vercel-storage.com/gallery/whatsapp-image-2026-09-10-at-11-04-36-pm-e.jpeg',
      category: 'गणेशोत्सव',
      date: '२०२६',
    },
    {
      id: 'photo-4',
      title: 'ग्रामस्थ मंडळ व युवा समिती एकत्रिकरण',
      titleEn: 'Mandal Gramastha & Youth Assembly',
      descriptionMarathi: 'चौकीचीवाडी ग्रामस्थ व युवा मंडळाचे गाव विकासासाठी एकत्रित संघटन आणि बैठक.',
      imageUrl: 'https://6naqxz7ixq636nw8.public.blob.vercel-storage.com/gallery/whatsapp-image-2026-09-10-at-11-04-36-pm.jpeg',
      category: 'ग्रामस्थ मंडळ',
      date: '२०२६',
    },
    {
      id: 'photo-5',
      title: 'मंदिर उत्सव व धार्मिक पूजा विधी',
      titleEn: 'Temple Festival & Sacred Rituals',
      descriptionMarathi: 'मंदिरातील पवित्र धार्मिक विधी, होम-हवन व मंगल पूजा सोहळा.',
      imageUrl: 'https://6naqxz7ixq636nw8.public.blob.vercel-storage.com/gallery/whatsapp-image-2026-09-10-at-11-04-37-pm-1-.jpeg',
      category: 'मंदिर व पूजा',
      date: '२०२६',
    },
    {
      id: 'photo-6',
      title: 'वार्षिक उत्सव व महाप्रसाद सोहळा',
      titleEn: 'Annual Utsav & Mahaprasad Gathering',
      descriptionMarathi: 'उत्सवाच्या निमित्ताने सर्व भाविक आणि ग्रामस्थांसाठी आयोजित महाप्रसाद व सेवा.',
      imageUrl: 'https://6naqxz7ixq636nw8.public.blob.vercel-storage.com/gallery/whatsapp-image-2026-09-10-at-11-04-37-pm-2-.jpeg',
      category: 'उत्सव क्षण',
      date: '२०२६',
    },
    {
      id: 'photo-7',
      title: 'ग्रामस्थ बैठक व सामाजिक नियोजन',
      titleEn: 'Gramastha Sabha & Community Discussion',
      descriptionMarathi: 'मंडळाच्या वार्षिक सभा, ठराव आणि सामाजिक नियोजन कार्यक्रम.',
      imageUrl: 'https://6naqxz7ixq636nw8.public.blob.vercel-storage.com/gallery/whatsapp-image-2026-09-10-at-11-04-37-pm.jpeg',
      category: 'ग्रामस्थ मंडळ',
      date: '२०२६',
    },
    {
      id: 'photo-8',
      title: 'श्री साई पालखी आगमन व स्वागत सोहळा',
      titleEn: 'Sai Palkhi Welcoming Moments',
      descriptionMarathi: 'पालखीचे गावात उत्साहात स्वागत, फटाक्यांची आतषबाजी आणि जयघोष.',
      imageUrl: 'https://6naqxz7ixq636nw8.public.blob.vercel-storage.com/gallery/whatsapp-image-2026-09-10-at-11-04-38-pm-1-.jpeg',
      category: 'पालखी सोहळा',
      date: '२०२६',
    },
    {
      id: 'photo-9',
      title: 'उत्सव सजावट व मंडप रोषणाई',
      titleEn: 'Festival Decoration & Illumination',
      descriptionMarathi: 'सण-उत्सवानिमित्त केलेली आकर्षक विद्युत रोषणाई व मंडप सजावट.',
      imageUrl: 'https://6naqxz7ixq636nw8.public.blob.vercel-storage.com/gallery/whatsapp-image-2026-09-10-at-11-04-38-pm-2-.jpeg',
      category: 'उत्सव क्षण',
      date: '२०२६',
    },
    {
      id: 'photo-10',
      title: 'अखंड हरिनाम सप्ताह व सांस्कृतिक कार्यक्रम',
      titleEn: 'Harinaam Saptah & Cultural Events',
      descriptionMarathi: 'चौकीचीवाडी ग्रामस्थांचा पारंपारिक भक्ती सोहळा व सांस्कृतिक सादरीकरण.',
      imageUrl: 'https://6naqxz7ixq636nw8.public.blob.vercel-storage.com/gallery/whatsapp-image-2026-09-10-at-11-04-38-pm.jpeg',
      category: 'भजन व आरती',
      date: '२०२६',
    },
  ];

  // Extract unique categories for filtering
  const categories = ['all', ...Array.from(new Set(galleryPhotos.map((p) => p.category)))];

  const filteredPhotos = selectedCategory === 'all'
    ? galleryPhotos
    : galleryPhotos.filter((p) => p.category === selectedCategory);

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const showNextPhoto = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => ((prev! + 1) % filteredPhotos.length));
  }, [activePhotoIndex, filteredPhotos.length]);

  const showPrevPhoto = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => ((prev! - 1 + filteredPhotos.length) % filteredPhotos.length));
  }, [activePhotoIndex, filteredPhotos.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextPhoto();
      if (e.key === 'ArrowLeft') showPrevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, showNextPhoto, showPrevPhoto]);

  // Copy shareable link
  const copyPhotoLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedGeneral(true);
    setTimeout(() => setCopiedGeneral(false), 2000);
  };

  const currentPhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-amber-50/30 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-200/80 text-orange-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <ImageIcon className="w-4 h-4 text-orange-600" />
            <span>अधिकृत छायाचित्र दालन (Photo Gallery)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            उत्सव व उपक्रम छायाचित्रे
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            चौकीचीवाडी ग्रामस्थ मंडळाच्या विविध धार्मिक उत्सव, श्री साईबाबा पालखी सोहळा, गणेशोत्सव आणि सामाजिक उपक्रमांचे क्षणचित्रे.
          </p>
        </div>

        {/* Instagram Connect Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 p-1 shadow-xl">
          <div className="relative rounded-[22px] bg-slate-900/90 backdrop-blur-xl text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5">
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 shadow-lg flex-shrink-0 animate-pulse">
                  <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden">
                    <img 
                      src={settings?.logoUrl || '/logo.png'} 
                      alt="Logo" 
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
                  मंडळाचे सर्व चालू उत्सव, थेट व्हिडिओ, पालखी सोहळा व उपक्रमांच्या नवीन फोटोंसाठी आमच्या इन्स्टाग्राम खात्याला फॉलो करा.
                </p>
              </div>
            </div>

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

              <button
                onClick={copyPageLink}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-2xl border border-white/20 transition text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedGeneral ? 'लिंक कॉपी झाली!' : 'गॅलरी शेअर करा'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const label = cat === 'all' ? 'सर्व छायाचित्रे (All)' : cat;
            const count = cat === 'all' 
              ? galleryPhotos.length 
              : galleryPhotos.filter((p) => p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 scale-105'
                    : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200/80 shadow-sm'
                }`}
              >
                <Tag className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-orange-500'}`} />
                <span>{label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(index)}
              className="group bg-white rounded-3xl overflow-hidden border border-orange-100 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] bg-stone-900 overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center space-x-1 bg-black/60 backdrop-blur-md text-amber-300 border border-white/20 text-[11px] font-bold px-3 py-1 rounded-full shadow">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{photo.category}</span>
                  </span>
                </div>

                {/* Quick Zoom Icon */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-amber-400">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Photo Number */}
                <div className="absolute bottom-3 right-3 z-10 text-[11px] font-bold text-white/80 bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                  {photo.date}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug group-hover:text-orange-600 transition">
                    {photo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {photo.descriptionMarathi}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-orange-600 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>पूर्ण फोटो पहा</span>
                    <span>→</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyPhotoLink(photo.imageUrl, photo.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                    title="Copy Photo URL"
                  >
                    {copiedLink === photo.id ? (
                      <span className="text-[10px] text-green-600 font-bold">कॉपी केले!</span>
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call To Action */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              आमच्याशी इन्स्टाग्रामवर जोडले जा!
            </h3>
            <p className="text-amber-100 text-sm sm:text-base">
              मंडळाचे सर्व आगामी कार्यक्रम, पालखी सोहळा व उत्सवाचे क्षण थेट पाहण्यासाठी आत्ताच फॉलो करा.
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

      {/* High-Resolution Photo Lightbox Modal */}
      {currentPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Top Bar */}
          <div 
            className="flex items-center justify-between text-white w-full max-w-7xl mx-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3">
              <span className="bg-orange-500/20 text-orange-300 border border-orange-400/30 text-xs font-bold px-3 py-1 rounded-full">
                {currentPhoto.category}
              </span>
              <span className="text-xs text-gray-300">
                {(activePhotoIndex ?? 0) + 1} / {filteredPhotos.length}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={currentPhoto.imageUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
                title="Download Photo"
              >
                <Download className="w-5 h-5" />
              </a>

              <button
                onClick={() => copyPhotoLink(currentPhoto.imageUrl, currentPhoto.id)}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
                title="Share Photo"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={closeLightbox}
                className="p-2.5 bg-white/10 hover:bg-rose-600 text-white rounded-full transition"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Area */}
          <div 
            className="relative flex-grow flex items-center justify-center max-w-6xl w-full mx-auto my-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              onClick={showPrevPhoto}
              className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-orange-500 text-white backdrop-blur-md border border-white/10 transition z-20 shadow-lg"
              title="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Photo View */}
            <div className="max-h-[70vh] sm:max-h-[75vh] w-full flex items-center justify-center p-2">
              <img
                src={currentPhoto.imageUrl}
                alt={currentPhoto.title}
                className="max-h-[70vh] sm:max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl transition-transform"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={showNextPhoto}
              className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-orange-500 text-white backdrop-blur-md border border-white/10 transition z-20 shadow-lg"
              title="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption Bar */}
          <div 
            className="w-full max-w-3xl mx-auto text-center text-white space-y-1 pb-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base sm:text-xl font-bold text-white">
              {currentPhoto.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto">
              {currentPhoto.descriptionMarathi}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
