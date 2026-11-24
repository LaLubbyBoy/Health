import React, { useState, useEffect } from 'react';
import { Building2, Search, MapPin, Phone, Star, ShieldCheck, Activity } from 'lucide-react';
import { Hospital } from '../types';

export const HospitalsView: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await fetch('/api/hospitals');
      const data = await res.json();
      setHospitals(data);
    } catch (err) {
      console.error('Failed to fetch hospitals', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase()) || 
    h.location.toLowerCase().includes(search.toLowerCase()) ||
    h.services.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Hospitals & Clinics Directory</h1>
        <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-2xl">
          Discover verified partner hospitals, emergency care centers, specialist clinics, and available medical services across Nigeria.
        </p>

        {/* Search Bar */}
        <div className="mt-8 bg-white p-3 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="flex-1 flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input 
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by hospital name, location, or service..."
              className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Hospital Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 mt-3">Loading healthcare facilities...</p>
        </div>
      ) : filteredHospitals.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-lg">No hospitals found</h3>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredHospitals.map((hosp) => (
            <div key={hosp.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition flex flex-col justify-between">
              <div>
                <div className="relative h-60 overflow-hidden">
                  <img src={hosp.image} alt={hosp.name} className="w-full h-full object-cover" />
                  {hosp.emergency && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1.5">
                      <Activity className="w-4 h-4" />
                      <span>24/7 Emergency Care</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full shadow flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                    <span>{hosp.rating}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {hosp.type}
                    </span>
                    <h3 className="font-bold text-gray-900 text-xl mt-1.5">{hosp.name}</h3>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <p className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{hosp.location}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-gray-800">{hosp.phone}</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase mb-2">Available Departments & Services</p>
                    <div className="flex flex-wrap gap-1.5">
                      {hosp.services.map((srv, idx) => (
                        <span key={idx} className="text-xs bg-emerald-50 text-emerald-800 font-medium px-2.5 py-1 rounded-lg border border-emerald-100">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-100 mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Medical Facility</span>
                </span>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow transition">
                  Contact Facility
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
