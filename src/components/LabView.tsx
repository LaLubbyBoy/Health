import React, { useState, useEffect } from 'react';
import { FlaskConical, Search, CheckCircle, Calendar, ShieldCheck, Download, Clock, MapPin } from 'lucide-react';
import { LabTest, User } from '../types';

interface LabViewProps {
  currentUser: User | null;
}

export const LabView: React.FC<LabViewProps> = ({ currentUser }) => {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [date, setDate] = useState('2026-12-02');
  const [sampleType, setSampleType] = useState('Home Sample Collection');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await fetch('/api/laboratory/tests');
      const data = await res.json();
      setTests(data);
    } catch (err) {
      console.error('Failed to fetch lab tests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTest) return;

    try {
      const res = await fetch('/api/laboratory/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: currentUser?.id || 'u-5',
          patientName: currentUser?.name || 'Patient Blessing',
          testId: selectedTest.id,
          testName: selectedTest.name,
          price: selectedTest.price,
          date,
          sampleType
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedTest(null);
      }, 3000);
    } catch (err) {
      console.error('Lab booking failed', err);
    }
  };

  const filteredTests = tests.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row justify-between items-center">
        <div className="space-y-3">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Diagnostic & Laboratory Services
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Accurate Lab Tests & Home Sampling</h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl">
            Book certified laboratory tests with home sample collection by professional phlebotomists and secure digital result delivery.
          </p>
        </div>
      </div>

      {bookingSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-3 shadow-md">
          <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold">Laboratory Test Booked Successfully!</h4>
            <p className="text-xs text-emerald-700">Our phlebotomist will arrive for sample collection on your scheduled date.</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center space-x-3 bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm max-w-xl">
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input 
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search blood tests, lipid profile, malaria test..."
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </div>

      {/* Test Catalog */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 mt-3">Loading diagnostic tests...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div key={test.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col justify-between hover:shadow-xl transition">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-md uppercase">
                    {test.category}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{test.turnaround}</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{test.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{test.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Test Fee</p>
                  <p className="font-bold text-emerald-700 text-lg">₦{test.price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setSelectedTest(test)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition"
                >
                  Book Test
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100 p-6 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="font-bold text-lg text-gray-900">Book Lab Test</h3>
              <button onClick={() => setSelectedTest(null)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <h4 className="font-bold text-gray-900 text-sm">{selectedTest.name}</h4>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">Fee: ₦{selectedTest.price.toLocaleString()} • Turnaround: {selectedTest.turnaround}</p>
            </div>

            <form onSubmit={handleBookTest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Sample Collection Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Collection Method</label>
                <select 
                  value={sampleType}
                  onChange={e => setSampleType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Home Sample Collection">Home Sample Collection (Phlebotomist Visit)</option>
                  <option value="Walk-in Diagnostic Center">Walk-in Partner Diagnostic Center</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow transition"
              >
                Confirm Lab Booking & Pay ₦{selectedTest.price.toLocaleString()}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
