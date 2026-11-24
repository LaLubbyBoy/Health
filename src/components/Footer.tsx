import React from 'react';
import { Activity, Phone, Mail, MapPin, Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">MEDICARE</span>
                <span className="text-xl font-light text-emerald-400"> CONNECT</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed pr-6">
              Better Healthcare. Easier Access. Healthier Lives. Connecting patients with verified medical professionals, hospitals, telemedicine, online pharmacy, and laboratory diagnostics.
            </p>
            <div className="flex items-center space-x-3 text-xs text-emerald-400 font-semibold bg-emerald-950/60 p-3 rounded-xl border border-emerald-900 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Medical Professionals & Secure Records</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#doctors" className="hover:text-emerald-400 transition">Find a Doctor</a></li>
              <li><a href="#hospitals" className="hover:text-emerald-400 transition">Hospitals & Clinics</a></li>
              <li><a href="#telemedicine" className="hover:text-emerald-400 transition">Telemedicine</a></li>
              <li><a href="#pharmacy" className="hover:text-emerald-400 transition">Online Pharmacy</a></li>
              <li><a href="#laboratory" className="hover:text-emerald-400 transition">Laboratory Services</a></li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Specialties</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="hover:text-emerald-400 transition cursor-pointer">Cardiology</span></li>
              <li><span className="hover:text-emerald-400 transition cursor-pointer">Pediatrics</span></li>
              <li><span className="hover:text-emerald-400 transition cursor-pointer">General Medicine</span></li>
              <li><span className="hover:text-emerald-400 transition cursor-pointer">Gynecology & OB-GYN</span></li>
              <li><span className="hover:text-emerald-400 transition cursor-pointer">Neurology & Orthopedics</span></li>
            </ul>
          </div>

          {/* Contact & Emergency */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Emergency & Support</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Emergency Helpline</p>
                  <p className="text-white font-bold">+234 800 MEDICARE</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Support Email</p>
                  <p className="text-white">support@medicare.ng</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Headquarters</p>
                  <p className="text-white">Victoria Island, Lagos, Nigeria</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <p>© {new Date().getFullYear()} Medicare Connect Nigeria Ltd. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-emerald-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-emerald-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-emerald-400 cursor-pointer">Medical Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
