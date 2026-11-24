import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, Phone, Stethoscope, Building2, Pill, FlaskConical } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('blessing@gmail.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor' | 'hospital_admin' | 'pharmacist' | 'lab_provider'>('patient');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [hospital, setHospital] = useState('Lagos University Teaching Hospital');
  const [phone, setPhone] = useState('+234 812 345 6789');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email, password } 
        : { name, email, password, role, specialty, hospital, phone };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      onLogin(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoRole: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setIsLogin(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100 animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Medicare Connect</h3>
            <p className="text-xs text-emerald-100">{isLogin ? 'Sign in to your secure account' : 'Register for healthcare services'}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Quick Demo Accounts */}
          {isLogin && (
            <div className="mb-6 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
              <p className="font-semibold text-emerald-900 mb-2">⚡ Quick Demo Logins:</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => fillDemo('blessing@gmail.com', 'patient')} className="px-2.5 py-1 bg-white border border-emerald-300 rounded-md font-medium text-emerald-800 hover:bg-emerald-100 transition">
                  Patient
                </button>
                <button onClick={() => fillDemo('adebayo.doc@medicare.ng', 'doctor')} className="px-2.5 py-1 bg-white border border-emerald-300 rounded-md font-medium text-emerald-800 hover:bg-emerald-100 transition">
                  Doctor
                </button>
                <button onClick={() => fillDemo('emeka.pharm@medicare.ng', 'pharmacist')} className="px-2.5 py-1 bg-white border border-emerald-300 rounded-md font-medium text-emerald-800 hover:bg-emerald-100 transition">
                  Pharmacist
                </button>
                <button onClick={() => fillDemo('lab@medicare.ng', 'lab_provider')} className="px-2.5 py-1 bg-white border border-emerald-300 rounded-md font-medium text-emerald-800 hover:bg-emerald-100 transition">
                  Lab Provider
                </button>
                <button onClick={() => fillDemo('admin@medicare.ng', 'admin')} className="px-2.5 py-1 bg-white border border-emerald-300 rounded-md font-medium text-emerald-800 hover:bg-emerald-100 transition">
                  Admin
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Dr. John Doe / Patient Name"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Account Role</label>
                  <select 
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="patient">Patient (Seek Healthcare)</option>
                    <option value="doctor">Doctor / Specialist</option>
                    <option value="hospital_admin">Hospital / Clinic Administrator</option>
                    <option value="pharmacist">Licensed Pharmacist</option>
                    <option value="lab_provider">Laboratory Technician / Provider</option>
                  </select>
                </div>

                {role === 'doctor' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Specialty</label>
                      <input 
                        type="text" 
                        value={specialty}
                        onChange={e => setSpecialty(e.target.value)}
                        placeholder="Cardiology"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Hospital / Clinic</label>
                      <input 
                        type="text" 
                        value={hospital}
                        onChange={e => setHospital(e.target.value)}
                        placeholder="LUTH"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setIsLogin(false)} className="text-emerald-600 font-semibold hover:underline">
                  Register now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)} className="text-emerald-600 font-semibold hover:underline">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
