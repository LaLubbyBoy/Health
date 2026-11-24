import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, Calendar, FileText, Pill, FlaskConical, ShieldCheck, 
  DollarSign, Activity, Users, Building2, CheckCircle, Clock, AlertCircle, Plus 
} from 'lucide-react';
import { User, Appointment, MedicalRecord, PharmacyOrder, LabBooking } from '../types';

interface DashboardViewProps {
  currentUser: User | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ currentUser }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [pharmacyOrders, setPharmacyOrders] = useState<PharmacyOrder[]>([]);
  const [labBookings, setLabBookings] = useState<LabBooking[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      const [aptRes, recRes, ordRes, labRes, statsRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch(`/api/medical-records?patientId=${currentUser?.id || 'u-5'}`),
        fetch('/api/pharmacy/orders'),
        fetch('/api/laboratory/bookings'),
        currentUser?.role === 'admin' ? fetch('/api/admin/stats') : Promise.resolve(null)
      ]);

      setAppointments(await aptRes.json());
      setMedicalRecords(await recRes.json());
      setPharmacyOrders(await ordRes.json());
      setLabBookings(await labRes.json());
      if (statsRes) setAdminStats(await statsRes.json());
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Please Sign In to View Your Dashboard</h2>
        <p className="text-sm text-gray-500">Access your appointments, medical records, prescriptions, and healthcare operations.</p>
      </div>
    );
  }

  const role = currentUser.role;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-2xl shadow-inner">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {role.replace('_', ' ')} Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Welcome back, {currentUser.name}</h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">{currentUser.email} • {currentUser.hospital || currentUser.specialty || 'Verified Member'}</p>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-800">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-200">Secure Verified Account</span>
        </div>
      </div>

      {/* PATIENT DASHBOARD */}
      {role === 'patient' && (
        <div className="space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Calendar className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Upcoming Visits</p>
                <p className="text-2xl font-extrabold text-gray-900">{appointments.filter(a => a.status === 'confirmed').length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center space-x-4">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center"><FileText className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Medical Records</p>
                <p className="text-2xl font-extrabold text-gray-900">{medicalRecords.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><FlaskConical className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Lab Tests</p>
                <p className="text-2xl font-extrabold text-gray-900">{labBookings.length}</p>
              </div>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">My Appointments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase font-semibold">
                    <th className="pb-3">Doctor / Specialist</th>
                    <th className="pb-3">Specialty</th>
                    <th className="pb-3">Date & Time</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 font-bold text-gray-800">{apt.doctorName}</td>
                      <td className="py-3.5 text-emerald-700 font-medium">{apt.specialty}</td>
                      <td className="py-3.5 text-gray-600">{apt.date} at {apt.time}</td>
                      <td className="py-3.5 uppercase text-xs font-bold text-gray-500">{apt.type}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full">
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Electronic Medical Records */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Electronic Medical Records & Diagnoses</h3>
            <div className="space-y-4">
              {medicalRecords.map(rec => (
                <div key={rec.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-sm">Diagnosis: {rec.diagnosis}</span>
                    <span className="text-xs text-gray-400">{rec.date}</span>
                  </div>
                  <p className="text-xs text-gray-600">Attending Physician: <span className="font-semibold text-gray-800">{rec.doctorName}</span></p>
                  <p className="text-xs text-gray-600">Clinical Notes: {rec.notes}</p>
                  {rec.prescriptions.length > 0 && (
                    <p className="text-xs font-medium text-emerald-700">Prescription: {rec.prescriptions.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* DOCTOR DASHBOARD */}
      {role === 'doctor' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Calendar className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Assigned Appointments</p>
                <p className="text-2xl font-extrabold text-gray-900">{appointments.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center space-x-4">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Verified Status</p>
                <p className="text-xl font-extrabold text-emerald-600">Active & Verified</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Patient Appointment Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase font-semibold">
                    <th className="pb-3">Patient Name</th>
                    <th className="pb-3">Date & Time</th>
                    <th className="pb-3">Consultation Type</th>
                    <th className="pb-3">Notes</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 font-bold text-gray-800">{apt.patientName}</td>
                      <td className="py-3.5 text-gray-600">{apt.date} at {apt.time}</td>
                      <td className="py-3.5 uppercase text-xs font-bold text-gray-500">{apt.type}</td>
                      <td className="py-3.5 text-xs text-gray-500">{apt.notes}</td>
                      <td className="py-3.5">
                        <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow">
                          Start Consultation
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUPER ADMIN DASHBOARD */}
      {role === 'admin' && adminStats && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-semibold">Total Patients</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">{adminStats.totalPatients}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-semibold">Verified Doctors</p>
              <p className="text-3xl font-extrabold text-emerald-600 mt-1">{adminStats.totalDoctors}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-semibold">Appointments</p>
              <p className="text-3xl font-extrabold text-teal-600 mt-1">{adminStats.totalAppointments}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-semibold">Platform Revenue</p>
              <p className="text-3xl font-extrabold text-emerald-700 mt-1">₦{adminStats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
