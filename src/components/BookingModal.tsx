import React, { useState } from 'react';
import { X, Calendar, Clock, Video, Building2, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { Doctor, User } from '../types';

interface BookingModalProps {
  doctor: Doctor | null;
  currentUser: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ doctor, currentUser, onClose, onSuccess }) => {
  const [date, setDate] = useState('2026-12-01');
  const [time, setTime] = useState('10:00 AM');
  const [type, setType] = useState<'video' | 'in-person' | 'audio'>('video');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!doctor) return null;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: currentUser?.id || 'u-5',
          patientName: currentUser?.name || 'Patient Blessing',
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialty: doctor.specialty,
          date,
          time,
          type,
          fee: doctor.fee,
          notes
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to book appointment');

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-emerald-100 animate-in fade-in zoom-in duration-200">
        
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 text-white flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">Book Appointment with {doctor.name}</h3>
            <p className="text-xs text-emerald-100">{doctor.specialty} • {doctor.hospital}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Appointment Confirmed!</h4>
              <p className="text-sm text-gray-600">Your appointment with {doctor.name} on {date} at {time} has been successfully scheduled and verified.</p>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center space-x-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <img src={doctor.avatar} alt={doctor.name} className="w-14 h-14 rounded-full object-cover shadow" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{doctor.name}</h4>
                  <p className="text-xs text-emerald-700 font-medium">{doctor.specialty}</p>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Consultation Fee: ₦{doctor.fee.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Appointment Date</label>
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
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Time Slot</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <select 
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Consultation Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('video')}
                    className={`py-2.5 px-3 border rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                      type === 'video' ? 'bg-emerald-600 text-white border-emerald-600 shadow' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Video Call</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('in-person')}
                    className={`py-2.5 px-3 border rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                      type === 'in-person' ? 'bg-emerald-600 text-white border-emerald-600 shadow' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>In-Person</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('audio')}
                    className={`py-2.5 px-3 border rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                      type === 'audio' ? 'bg-emerald-600 text-white border-emerald-600 shadow' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Audio Call</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Reason for Visit / Symptoms</label>
                <textarea 
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Describe your symptoms or reason for consulting the doctor..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-700 font-medium">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>Secure Payment (Paystack / Flutterwave)</span>
                </div>
                <span className="font-bold text-emerald-700">₦{doctor.fee.toLocaleString()}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl shadow-md transition duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>Confirm Booking & Pay ₦{doctor.fee.toLocaleString()}</span>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
