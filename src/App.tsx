import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { FindDoctorView } from './components/FindDoctorView';
import { HospitalsView } from './components/HospitalsView';
import { TelemedicineView } from './components/TelemedicineView';
import { PharmacyView } from './components/PharmacyView';
import { LabView } from './components/LabView';
import { AiAssistantView } from './components/AiAssistantView';
import { ArticlesView } from './components/ArticlesView';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { User, Doctor, Hospital, HealthArticle } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [articles, setArticles] = useState<HealthArticle[]>([]);

  useEffect(() => {
    // Check initial session or default demo patient
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [docRes, hospRes, artRes] = await Promise.all([
        fetch('/api/doctors'),
        fetch('/api/hospitals'),
        fetch('/api/articles')
      ]);

      const docData = await docRes.json();
      const hospData = await hospRes.json();
      const artData = await artRes.json();

      setDoctors(docData);
      setHospitals(hospData);
      setArticles(artData);

      // Default demo patient login for seamless out-of-the-box experience
      const patient = docData.find((d: any) => d.role === 'patient') || {
        id: 'u-5',
        name: 'Patient Blessing',
        email: 'blessing@gmail.com',
        role: 'patient',
        phone: '+234 812 345 6789'
      };
      // Let's keep currentUser null by default or set a default demo user if desired.
      // Setting default demo user so user instantly sees dashboard & profile active:
      setCurrentUser({
        id: 'u-5',
        name: 'Patient Blessing',
        email: 'blessing@gmail.com',
        role: 'patient',
        phone: '+234 812 345 6789',
        address: '15 Admiralty Way, Lekki, Lagos'
      });
    } catch (err) {
      console.error('Failed to load initial app data', err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-emerald-500 selection:text-white">
      
      {/* Navigation */}
      <Navbar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Views */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView 
            setCurrentTab={setCurrentTab}
            onSelectDoctor={(doc) => setSelectedDoctor(doc)}
            doctors={doctors}
            hospitals={hospitals}
            articles={articles}
          />
        )}
        {currentTab === 'doctors' && (
          <FindDoctorView 
            onSelectDoctor={(doc) => setSelectedDoctor(doc)}
          />
        )}
        {currentTab === 'hospitals' && <HospitalsView />}
        {currentTab === 'telemedicine' && <TelemedicineView currentUser={currentUser} />}
        {currentTab === 'pharmacy' && <PharmacyView currentUser={currentUser} />}
        {currentTab === 'laboratory' && <LabView currentUser={currentUser} />}
        {currentTab === 'ai-assistant' && <AiAssistantView />}
        {currentTab === 'articles' && <ArticlesView />}
        {currentTab === 'dashboard' && <DashboardView currentUser={currentUser} />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={(user) => setCurrentUser(user)}
      />

      <BookingModal 
        doctor={selectedDoctor}
        currentUser={currentUser}
        onClose={() => setSelectedDoctor(null)}
        onSuccess={() => {
          setSelectedDoctor(null);
          setCurrentTab('dashboard');
        }}
      />

    </div>
  );
}
