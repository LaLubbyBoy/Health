import React from 'react';
import { 
  Search, Stethoscope, Building2, Pill, FlaskConical, ShieldCheck, 
  Video, ArrowRight, Star, Heart, CheckCircle2, Award, Users, Activity 
} from 'lucide-react';
import { Doctor, Hospital, HealthArticle } from '../types';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  onSelectDoctor: (doctor: Doctor) => void;
  doctors: Doctor[];
  hospitals: Hospital[];
  articles: HealthArticle[];
}

export const HomeView: React.FC<HomeViewProps> = ({ setCurrentTab, onSelectDoctor, doctors, hospitals, articles }) => {
  const specialties = [
    { name: 'Cardiology', icon: Heart, count: '14 Doctors', color: 'bg-rose-50 text-rose-600 border-rose-200' },
    { name: 'Pediatrics', icon: Users, count: '18 Doctors', color: 'bg-sky-50 text-sky-600 border-sky-200' },
    { name: 'General Medicine', icon: Stethoscope, count: '25 Doctors', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { name: 'Gynecology', icon: Activity, count: '12 Doctors', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { name: 'Neurology', icon: Award, count: '8 Doctors', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { name: 'Dentistry', icon: ShieldCheck, count: '10 Doctors', color: 'bg-teal-50 text-teal-600 border-teal-200' },
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-emerald-800/80 border border-emerald-600/50 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Nigeria's Premier Verified Digital Healthcare Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Better Healthcare. <br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">Easier Access.</span> Healthier Lives.
              </h1>
              <p className="text-lg text-emerald-100/90 leading-relaxed max-w-xl">
                Connect instantly with verified doctors, world-class hospitals, secure telemedicine video consultations, online pharmacy delivery, and laboratory diagnostics.
              </p>

              {/* Quick Search Bar */}
              <div className="bg-white p-3 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="flex-1 flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search doctors, specialties, hospitals..." 
                    className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                    onKeyDown={(e) => { if (e.key === 'Enter') setCurrentTab('doctors'); }}
                  />
                </div>
                <button 
                  onClick={() => setCurrentTab('doctors')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition flex items-center justify-center space-x-2"
                >
                  <span>Search Care</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-6 pt-4 text-xs font-medium text-emerald-200">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Verified Physicians</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Secure Telemedicine</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Paystack & Flutterwave</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80" 
                  alt="Doctor with patient" 
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-lg shadow">
                      Dr
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Dr. Adebayo Johnson</h4>
                      <p className="text-xs text-emerald-300">Consultant Cardiologist • LUTH</p>
                      <div className="flex items-center space-x-1 mt-1 text-xs text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>4.9 (120+ Verified Reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 p-6 text-center">
          <div className="p-4">
            <p className="text-3xl font-extrabold text-emerald-600">500+</p>
            <p className="text-xs font-semibold text-gray-500 uppercase mt-1">Verified Doctors</p>
          </div>
          <div className="p-4">
            <p className="text-3xl font-extrabold text-teal-600">50+</p>
            <p className="text-xs font-semibold text-gray-500 uppercase mt-1">Partner Hospitals</p>
          </div>
          <div className="p-4">
            <p className="text-3xl font-extrabold text-emerald-600">24/7</p>
            <p className="text-xs font-semibold text-gray-500 uppercase mt-1">Telemedicine Care</p>
          </div>
          <div className="p-4">
            <p className="text-3xl font-extrabold text-teal-600">10k+</p>
            <p className="text-xs font-semibold text-gray-500 uppercase mt-1">Patients Served</p>
          </div>
        </div>
      </section>

      {/* Medical Specialties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Medical Specialties</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">Find Care by Specialty</h3>
          </div>
          <button 
            onClick={() => setCurrentTab('doctors')}
            className="text-emerald-700 font-semibold text-sm hover:underline flex items-center space-x-1"
          >
            <span>View All Specialties</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {specialties.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <div 
                key={idx}
                onClick={() => setCurrentTab('doctors')}
                className={`p-5 rounded-2xl border ${spec.color} hover:shadow-lg transition cursor-pointer flex flex-col items-center text-center space-y-3 bg-white`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${spec.color} shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{spec.name}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{spec.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Expert Physicians</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">Top Verified Doctors</h3>
          </div>
          <button 
            onClick={() => setCurrentTab('doctors')}
            className="text-emerald-700 font-semibold text-sm hover:underline flex items-center space-x-1"
          >
            <span>Browse All Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.slice(0, 4).map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition flex flex-col justify-between">
              <div>
                <div className="relative h-48 overflow-hidden bg-emerald-50">
                  <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 text-base">{doc.name}</h4>
                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-emerald-700">{doc.specialty}</p>
                  <p className="text-xs text-gray-500">{doc.hospital}</p>
                  <p className="text-xs text-gray-500">{doc.experience} experience</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-gray-100 mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Consultation Fee</p>
                  <p className="font-bold text-gray-900 text-sm">₦{doc.fee.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => onSelectDoctor(doc)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Health Assistant Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-teal-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
            <Activity className="w-96 h-96" />
          </div>
          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Powered by Google Gemini AI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Need Instant Health Guidance?</h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Use our AI Health Assistant to understand symptoms, get reliable medical terminology explanations, prepare questions for your doctor, and find appropriate medical specialties.
            </p>
            <button 
              onClick={() => setCurrentTab('ai-assistant')}
              className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-6 py-3.5 rounded-xl shadow-lg transition flex items-center space-x-2 text-sm"
            >
              <span>Launch AI Health Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Partner Hospitals Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Healthcare Facilities</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">Top Partner Hospitals & Clinics</h3>
          </div>
          <button 
            onClick={() => setCurrentTab('hospitals')}
            className="text-emerald-700 font-semibold text-sm hover:underline flex items-center space-x-1"
          >
            <span>View All Facilities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.slice(0, 3).map((hosp) => (
            <div key={hosp.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition">
              <div className="relative h-48 overflow-hidden">
                <img src={hosp.image} alt={hosp.name} className="w-full h-full object-cover" />
                {hosp.emergency && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                    24/7 Emergency Care
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <h4 className="font-bold text-gray-900 text-base">{hosp.name}</h4>
                <p className="text-xs text-gray-500">{hosp.location}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {hosp.services.slice(0, 3).map((srv, i) => (
                    <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-md">
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
