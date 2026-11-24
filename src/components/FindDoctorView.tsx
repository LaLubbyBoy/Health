import React, { useState, useEffect } from 'react';
import { Search, Stethoscope, Star, ShieldCheck, MapPin, Award, Calendar, Video, Building2 } from 'lucide-react';
import { Doctor } from '../types';

interface FindDoctorViewProps {
  onSelectDoctor: (doctor: Doctor) => void;
}

export const FindDoctorView: React.FC<FindDoctorViewProps> = ({ onSelectDoctor }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [loading, setLoading] = useState(true);

  const specialties = [
    'All',
    'Cardiology',
    'Pediatrics',
    'General Medicine',
    'Gynecology & Obstetrics',
    'Neurology',
    'Orthopedics',
    'Dermatology',
    'Psychiatry'
  ];

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty, search]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSpecialty !== 'All') params.append('specialty', selectedSpecialty);
      if (search) params.append('search', search);

      const res = await fetch(`/api/doctors?${params.toString()}`);
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Find a Verified Doctor</h1>
        <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-2xl">
          Search Nigeria's top medical specialists, review credentials, check availability, and book instant in-person or telemedicine appointments.
        </p>

        {/* Search Bar */}
        <div className="mt-8 bg-white p-3 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="flex-1 flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input 
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by doctor name, specialty, or hospital..."
              className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
            />
          </div>
          <button 
            onClick={fetchDoctors}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Specialty Filter Pills */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition shadow-sm ${
              selectedSpecialty === spec 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Doctor Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 mt-3">Loading verified doctors...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
          <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-lg">No doctors found</h3>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria or specialty filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition flex flex-col justify-between">
              <div>
                <div className="relative h-52 overflow-hidden bg-emerald-50">
                  <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Professional</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{doc.name}</h3>
                      <p className="text-xs font-semibold text-emerald-700 mt-0.5">{doc.specialty}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs text-gray-600">
                    <p className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span>{doc.hospital}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span>{doc.experience} Experience</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-100 mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Consultation Fee</p>
                  <p className="font-bold text-gray-900 text-base">₦{doc.fee.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => onSelectDoctor(doc)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-3 rounded-xl shadow transition flex items-center space-x-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Visit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
