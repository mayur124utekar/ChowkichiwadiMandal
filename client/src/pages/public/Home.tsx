import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  FileText,
  HeartHandshake
} from 'lucide-react';
import { PublicAPI } from '../../api/client.js';
import { Member, Event, Meeting } from '../../types/index.js';
import { MemberAvatar } from '../../components/MemberAvatar.js';

export const Home: React.FC = () => {
  const [data, setData] = useState<{
    settings: any;
    groups: any[];
    stats: { totalMembers: number };
    latestEvent: Event | null;
    latestMeeting: Meeting | null;
  } | null>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [finance, setFinance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      PublicAPI.getMandalInfo(),
      PublicAPI.getMembers(),
      PublicAPI.getFinancialSummary(),
    ])
      .then(([infoRes, membersRes, finRes]) => {
        setData(infoRes);
        setMembers(membersRes.slice(0, 8)); // Highlight key members
        setFinance(finRes);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number | string) => {
    const num = Number(val || 0);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-amber-50/40 to-[#FFFBF7] pt-12 pb-20 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-orange-100/90 text-orange-800 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-orange-200 shadow-sm">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>॥ श्री साईबाबा प्रसन्न ॥</span>
                <span className="text-orange-400">•</span>
                <span>रजि. क्र.: महाराष्ट्र/०१३/२०२०/रत्ना.</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                {data?.settings?.mandalNameMarathi || 'चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ'}
              </h1>
              
              <p className="text-lg sm:text-xl text-orange-700 font-medium">
                साखर चौकीचीवाडी (युवा ग्रुप) • ता. खेड, जि. रत्नागिरी
              </p>

              <p className="text-gray-600 text-base sm:text-lg max-w-2xl leading-relaxed">
                ग्रामविकास, अध्यात्मिक प्रबोधन, सामाजिक एकता आणि पारदर्शक व्यवस्थापनाचे आमचे ध्येय. गावातील सामान्य व युवा बंधू-भगिनींच्या सहकार्यातून मंडळाची वाटचाल सुरू आहे.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/members"
                  className="px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-600/30 hover:shadow-orange-600/40 transition-all flex items-center space-x-2"
                >
                  <Users className="w-5 h-5" />
                  <span>कार्यकारिणी सदस्य</span>
                </Link>

                <Link
                  to="/monthly-contributions"
                  className="px-6 py-3.5 bg-white hover:bg-orange-50 text-gray-800 border border-gray-200 hover:border-orange-300 font-semibold rounded-xl shadow-sm transition-all flex items-center space-x-2"
                >
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <span>मासिक वर्गणी व हिशोब</span>
                </Link>
              </div>
            </div>

            {/* Hero Right Visual Banner */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 sm:w-80 md:w-96 aspect-square">
                {/* Decorative aura circles */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/20 to-amber-300/30 rounded-full blur-2xl transform -scale-95 animate-pulse"></div>
                <div className="relative bg-white rounded-3xl p-6 shadow-2xl border-4 border-orange-200/80 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-orange-500 shadow-md p-1 bg-white">
                    <img
                      src={data?.settings?.logoUrl || '/logo.jpeg'}
                      alt="मंडळ लोगो"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-200 w-full">
                    <h2 className="font-bold text-gray-800 text-sm">साखर चौकीचीवाडी</h2>
                    <p className="text-xs text-orange-700 font-medium">अध्यात्मिक व सामाजिक ग्रामस्थ मंडळ</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Statistics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{data?.stats?.totalMembers || 8}+</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">एकूण नोंदणीकृत सदस्य</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">२ गट</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">सामान्य व युवा गट</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700">
              {finance && !finance.isHidden ? formatCurrency(finance.totalBalance) : '१००%'}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
              {finance && !finance.isHidden ? 'मंडळ एकूण शिल्लक निधी' : 'पारदर्शक हिशोब'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">२०२०</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">शासकीय नोंदणी वर्ष</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-orange-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center space-x-2 text-orange-600 font-bold text-sm tracking-wide uppercase">
                <span className="w-6 h-0.5 bg-orange-500"></span>
                <span>मंडळाबद्दल माहिती</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                साखर चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळाची परंपरा व उद्दिष्टे
              </h2>
              <p className="text-gray-600 leading-relaxed">
                आमचे मंडळ गावातील सामाजिक बांधिलकी, धार्मिक उत्सव, युवकांचे संघटन आणि गावातील गरजू घटकांना सहाय्य करण्यासाठी कटिबद्ध आहे. नियमित मासिक वर्गणी व सण-उत्सवांच्या देणग्यांचा परिपूर्ण हिशोब ठेवून पारदर्शकता राखणे हे आमचे प्रथम कर्तव्य आहे.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>धार्मिक व अध्यात्मिक उत्सव</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>युवा पिढीचे सक्रिय नेतृत्व</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>पारदर्शक जमा-खर्च हिशोब</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>नियमित ग्रामस्थ सभा व नियोजन</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center space-x-2 text-orange-600 font-bold hover:text-orange-700 hover:underline transition"
                >
                  <span>अधिक माहिती वाचा</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="text-xs uppercase tracking-widest text-orange-100 font-bold">मंडळ नियम व वर्गणी</div>
                <h3 className="text-2xl font-bold">मासिक वर्गणी संकल्पना</h3>
                <p className="text-orange-100 text-sm leading-relaxed">
                  मंडळाच्या नियमित कार्यासाठी प्रत्येक सभासदाकडून दरमहा नाममात्र <strong>₹{data?.settings?.monthlyTargetAmount || 200}/-</strong> वर्गणी जमा केली जाते. या वर्गणीतून गावातील धार्मिक कार्ये, मंदिर परिसर स्वच्छता आणि सामाजिक उपक्रम चालवले जातात.
                </p>
                <div className="pt-2">
                  <Link
                    to="/monthly-contributions"
                    className="inline-block bg-white text-orange-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-50 transition shadow"
                  >
                    मासिक वर्गणी तपासा
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Members Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-orange-100 pb-4">
          <div>
            <div className="text-xs text-orange-600 font-bold uppercase tracking-wider">आमची कार्यकारणी</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">मंडळाचे प्रमुख पदाधिकारी व सदस्य</h2>
          </div>
          <Link
            to="/members"
            className="inline-flex items-center space-x-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 transition"
          >
            <span>सर्व सदस्य पहा</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-orange-100/80 shadow-sm hover:shadow-md transition text-center flex flex-col items-center group"
            >
              <div className="p-1 rounded-full border-2 border-orange-200 group-hover:border-orange-500 transition-colors bg-orange-50 mb-3">
                <MemberAvatar
                  photoUrl={member.photoUrl}
                  name={member.fullNameMarathi || member.fullName}
                  size="lg"
                />
              </div>

              <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug">
                {member.fullNameMarathi || member.fullName}
              </h3>

              <div className="mt-1.5 inline-block bg-orange-100/70 text-orange-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                {member.position?.nameMarathi || 'सदस्य'}
              </div>

              <div className="text-[11px] text-gray-400 mt-2">
                {member.group?.nameMarathi}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Event & Meeting Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Latest Festival Card */}
          {data?.latestEvent && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-orange-600 uppercase tracking-wide mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>आगामी / प्रमुख उत्सव</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {data.latestEvent.nameMarathi}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {data.latestEvent.descriptionMarathi || 'उत्सवाचे नियोजन, वर्गणी संकलन आणि कार्यक्रमांची माहिती.'}
                </p>
                <div className="bg-orange-50/70 p-3 rounded-xl border border-orange-100 text-xs text-orange-900 space-y-1">
                  <div><strong>उत्सव दिनांक:</strong> {new Date(data.latestEvent.eventDate).toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  {data.latestEvent.targetAmount && (
                    <div><strong>अपेक्षित निधी:</strong> ₹{Number(data.latestEvent.targetAmount).toLocaleString('en-IN')}</div>
                  )}
                </div>
              </div>
              <div className="pt-6">
                <Link
                  to="/events"
                  className="inline-flex items-center space-x-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition"
                >
                  <span>उत्सव वर्गणी व तपशील पहा</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Latest Meeting Card */}
          {data?.latestMeeting && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wide mb-2">
                  <FileText className="w-4 h-4" />
                  <span>अलीकडील ग्रामस्थ सभा</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {data.latestMeeting.meetingTitleMarathi}
                </h3>
                <div className="text-xs text-gray-500 mb-3">
                  दिनांक: {new Date(data.latestMeeting.meetingDate).toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • {data.latestMeeting.location}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                  {data.latestMeeting.decisionsMarathi || 'सभेतील महत्त्वाचे निर्णय आणि अहवाल.'}
                </p>
              </div>
              <div className="pt-6">
                <Link
                  to="/meetings"
                  className="inline-flex items-center space-x-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition"
                >
                  <span>सभेचे सर्व ठराव व नोंदी पहा</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
