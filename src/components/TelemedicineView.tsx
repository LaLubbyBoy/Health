import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, FileText, Send, ShieldCheck, Stethoscope, AlertCircle } from 'lucide-react';
import { User, Appointment } from '../types';

interface TelemedicineViewProps {
  currentUser: User | null;
}

export const TelemedicineView: React.FC<TelemedicineViewProps> = ({ currentUser }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeSession, setActiveSession] = useState<Appointment | null>(null);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Dr. Adebayo Johnson', text: 'Hello! Welcome to your secure video consultation on Medicare Connect. How are you feeling today?', time: '10:00 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [rxMed, setRxMed] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [currentUser]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(data);
      if (data.length > 0 && !activeSession) {
        setActiveSession(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages([...chatMessages, { sender: currentUser?.name || 'Patient', text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInputMsg('');
  };

  const handleSaveClinicalNotes = async () => {
    if (!activeSession) return;
    try {
      await fetch('/api/medical-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: activeSession.patientId,
          doctorName: activeSession.doctorName,
          diagnosis: clinicalNotes,
          notes: 'Consultation conducted via secure telemedicine.',
          prescriptions: rxMed ? [rxMed] : []
        })
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save record', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center">
        <div>
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Secure Telemedicine Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">HD Video & Audio Consultations</h1>
          <p className="text-emerald-100 text-sm mt-1">Encrypted peer-to-peer virtual consultation rooms with doctor notes and prescription management.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-800">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-200">End-to-End Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Video / Main Room Screen */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl h-[450px] flex items-center justify-center border border-gray-800">
            {videoOn ? (
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1000&auto=format&fit=crop&q=80" 
                  alt="Doctor Video feed" 
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Dr. Adebayo Johnson (Cardiologist)</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 space-y-2">
                <VideoOff className="w-12 h-12 mx-auto text-gray-500" />
                <p className="text-sm font-semibold">Camera is turned off</p>
              </div>
            )}

            {/* In-Call Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-gray-950/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-800 shadow-xl">
              <button 
                onClick={() => setAudioOn(!audioOn)}
                className={`p-3 rounded-full transition ${audioOn ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-red-600 text-white'}`}
              >
                {audioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setVideoOn(!videoOn)}
                className={`p-3 rounded-full transition ${videoOn ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-red-600 text-white'}`}
              >
                {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => alert('Consultation ended successfully.')}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition shadow"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Doctor Tools Panel (If Doctor role) */}
          {currentUser?.role === 'doctor' && (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900 text-base flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Clinical Notes & Prescription Issuer</span>
              </h3>
              {savedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg font-semibold">
                  Clinical record & prescription saved successfully!
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Diagnosis & Clinical Notes</label>
                  <textarea 
                    rows={2}
                    value={clinicalNotes}
                    onChange={e => setClinicalNotes(e.target.value)}
                    placeholder="Enter patient diagnosis, observations, and recommendations..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Prescribe Medication</label>
                  <input 
                    type="text"
                    value={rxMed}
                    onChange={e => setRxMed(e.target.value)}
                    placeholder="e.g. Amlodipine 5mg - 1 tablet daily for 30 days"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <button 
                  onClick={handleSaveClinicalNotes}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow transition"
                >
                  Save to Patient Electronic Medical Record
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Consultation Chat & Scheduled Appointments */}
        <div className="space-y-6">
          
          {/* Chat Box */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col h-[450px]">
            <h3 className="font-bold text-gray-900 text-base flex items-center space-x-2 pb-3 border-b border-gray-100">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Consultation Chat</span>
            </h3>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`p-3 rounded-2xl text-xs space-y-1 ${msg.sender === currentUser?.name ? 'bg-emerald-50 ml-6 border border-emerald-100' : 'bg-gray-50 mr-6 border border-gray-200'}`}>
                  <div className="flex justify-between font-bold text-gray-700">
                    <span>{msg.sender}</span>
                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-gray-800">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="pt-3 border-t border-gray-100 flex gap-2">
              <input 
                type="text"
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                placeholder="Type message to doctor..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl shadow transition">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
