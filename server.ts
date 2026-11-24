import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// In-Memory Database for Medicare Connect
let users = [
  { id: 'u-1', name: 'Dr. Adebayo Johnson', email: 'adebayo.doc@medicare.ng', role: 'doctor', specialty: 'Cardiology', hospital: 'Lagos University Teaching Hospital', verified: true, phone: '+234 803 123 4567', experience: '12 years', fee: 15000, rating: 4.9, avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80' },
  { id: 'u-2', name: 'Dr. Chioma Okafor', email: 'chioma.doc@medicare.ng', role: 'doctor', specialty: 'Pediatrics', hospital: 'National Hospital Abuja', verified: true, phone: '+234 802 987 6543', experience: '9 years', fee: 12000, rating: 4.8, avatar: 'https://images.unsplash.com/photo-1594824813578-834f8263102c?w=400&auto=format&fit=crop&q=80' },
  { id: 'u-3', name: 'Dr. Ibrahim Musa', email: 'ibrahim.doc@medicare.ng', role: 'doctor', specialty: 'General Medicine', hospital: 'Aminu Kano Teaching Hospital', verified: true, phone: '+234 805 555 7890', experience: '15 years', fee: 10000, rating: 4.7, avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80' },
  { id: 'u-4', name: 'Dr. Folashade Adeleke', email: 'folashade.doc@medicare.ng', role: 'doctor', specialty: 'Gynecology & Obstetrics', hospital: 'University College Hospital Ibadan', verified: true, phone: '+234 809 111 2233', experience: '11 years', fee: 14000, rating: 4.9, avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80' },
  { id: 'u-5', name: 'Patient Blessing', email: 'blessing@gmail.com', role: 'patient', phone: '+234 812 345 6789', address: '15 Admiralty Way, Lekki, Lagos' },
  { id: 'u-6', name: 'Pharm. Emeka Obi', email: 'emeka.pharm@medicare.ng', role: 'pharmacist', pharmacyName: 'GreenCross Pharmacy Victoria Island', verified: true },
  { id: 'u-7', name: 'Dr. Nkiru Nnamdi', email: 'lab@medicare.ng', role: 'lab_provider', labName: 'Clina-Lancet Laboratories', verified: true },
  { id: 'u-8', name: 'Hospital Admin', email: 'admin@luth.gov.ng', role: 'hospital_admin', hospitalName: 'Lagos University Teaching Hospital (LUTH)', verified: true },
  { id: 'u-9', name: 'Super Admin', email: 'admin@medicare.ng', role: 'admin', verified: true },
];

let hospitals = [
  { id: 'h-1', name: 'Lagos University Teaching Hospital (LUTH)', location: 'Idi-Araba, Surulere, Lagos', type: 'Tertiary Hospital', emergency: true, phone: '+234 1 545 3540', services: ['Emergency Care', 'Cardiology', 'Surgery', 'Pediatrics', 'Radiology', 'Pharmacy', 'Laboratory'], rating: 4.8, image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80' },
  { id: 'h-2', name: 'National Hospital Abuja', location: 'Central District, Abuja', type: 'Federal Teaching Hospital', emergency: true, phone: '+234 9 290 2341', services: ['Trauma Center', 'Oncology', 'Obstetrics & Gynecology', 'Orthopedics', 'ICU', 'Laboratory'], rating: 4.9, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80' },
  { id: 'h-3', name: 'University College Hospital (UCH)', location: 'Queen Elizabeth Road, Ibadan', type: 'Tertiary Hospital', emergency: true, phone: '+234 2 241 0088', services: ['General Medicine', 'Neurology', 'Psychiatry', 'Dentistry', 'ENT', 'Pediatrics'], rating: 4.7, image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80' },
  { id: 'h-4', name: 'Evercare Hospital Lekki', location: 'Lekki Phase 1, Lagos', type: 'Private Specialist Hospital', emergency: true, phone: '+234 1 463 8000', services: ['Advanced Surgery', 'Cardiology', 'ICU', 'Pediatrics', 'Emergency', 'Diagnostics'], rating: 4.9, image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80' },
];

let appointments = [
  { id: 'apt-1', patientId: 'u-5', patientName: 'Patient Blessing', doctorId: 'u-1', doctorName: 'Dr. Adebayo Johnson', specialty: 'Cardiology', date: '2026-11-28', time: '10:00 AM', type: 'video', status: 'confirmed', fee: 15000, paid: true, notes: 'Routine checkup for hypertension management.' },
  { id: 'apt-2', patientId: 'u-5', patientName: 'Patient Blessing', doctorId: 'u-2', doctorName: 'Dr. Chioma Okafor', specialty: 'Pediatrics', date: '2026-12-02', time: '02:00 PM', type: 'in-person', status: 'pending', fee: 12000, paid: false, notes: 'Child immunization consultation.' },
];

let prescriptions = [
  { id: 'rx-1', patientId: 'u-5', patientName: 'Patient Blessing', doctorId: 'u-1', doctorName: 'Dr. Adebayo Johnson', date: '2026-11-10', medications: [{ name: 'Amlodipine 5mg', dosage: '1 tablet daily', duration: '30 days' }, { name: 'Lisinopril 10mg', dosage: '1 tablet daily', duration: '30 days' }], status: 'active', notes: 'Take with water after breakfast.' }
];

let pharmacyProducts = [
  { id: 'med-1', name: 'Paracetamol 500mg', category: 'Over-The-Counter', price: 1200, description: 'Effective pain relief and fever reducer.', inStock: true, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80', rxRequired: false },
  { id: 'med-2', name: 'Amoxicillin 500mg Capsules', category: 'Prescription Medicines', price: 3500, description: 'Broad-spectrum antibiotic for bacterial infections.', inStock: true, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=80', rxRequired: true },
  { id: 'med-3', name: 'Amlodipine 5mg', category: 'Prescription Medicines', price: 2800, description: 'Calcium channel blocker for blood pressure.', inStock: true, image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&auto=format&fit=crop&q=80', rxRequired: true },
  { id: 'med-4', name: 'First Aid Trauma Kit', category: 'Medical Supplies', price: 15000, description: 'Complete emergency first aid supplies for home and office.', inStock: true, image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&auto=format&fit=crop&q=80', rxRequired: false },
  { id: 'med-5', name: 'Digital Blood Pressure Monitor', category: 'Healthcare Equipment', price: 22000, description: 'Accurate upper arm automatic digital BP monitor.', inStock: true, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop&q=80', rxRequired: false },
];

let pharmacyOrders = [
  { id: 'ord-1', patientId: 'u-5', patientName: 'Patient Blessing', items: [{ productId: 'med-1', name: 'Paracetamol 500mg', qty: 2, price: 1200 }], total: 2400, status: 'delivered', address: '15 Admiralty Way, Lekki, Lagos', date: '2026-11-15' }
];

let labTests = [
  { id: 'test-1', name: 'Complete Blood Count (CBC)', category: 'Blood Tests', price: 7500, description: 'Evaluates overall health and detects a wide range of disorders.', turnaround: '24 Hours' },
  { id: 'test-2', name: 'Lipid Profile (Cholesterol Test)', category: 'Blood Tests', price: 12000, description: 'Measures cholesterol and triglyceride levels for heart health.', turnaround: '24 Hours' },
  { id: 'test-3', name: 'Fasting Blood Sugar (FBS)', category: 'Blood Sugar Tests', price: 4500, description: 'Screening test for diabetes and blood glucose levels.', turnaround: '12 Hours' },
  { id: 'test-4', name: 'Liver Function Test (LFT)', category: 'Liver Function Tests', price: 15000, description: 'Checks liver enzymes and protein levels.', turnaround: '24 Hours' },
  { id: 'test-5', name: 'Malaria Parasite & Widal Test', category: 'Blood Tests', price: 6000, description: 'Tests for malaria parasite and typhoid fever.', turnaround: '6 Hours' },
];

let labBookings: any[] = [
  { id: 'lb-1', patientId: 'u-5', patientName: 'Patient Blessing', testId: 'test-1', testName: 'Complete Blood Count (CBC)', price: 7500, date: '2026-11-20', status: 'completed', sampleType: 'Home Collection', result: 'WBC: 6.5, RBC: 4.8, Hb: 13.5 g/dL (Normal Range). No abnormalities detected.' }
];

let healthArticles = [
  { id: 'art-1', title: 'Understanding Hypertension: Prevention and Management in Nigeria', category: 'Cardiovascular Health', author: 'Dr. Adebayo Johnson', date: '2026-11-18', readTime: '5 min read', summary: 'Hypertension is often called the silent killer. Learn practical dietary changes, exercise habits, and blood pressure monitoring.', content: 'Hypertension affects millions of Nigerians. Reducing salt intake, engaging in 30 minutes of aerobic exercise daily, and regular screening are critical steps to prevent stroke and heart disease.', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80' },
  { id: 'art-2', title: 'Managing Childhood Malaria: Signs Every Parent Should Know', category: 'Children\'s Health', author: 'Dr. Chioma Okafor', date: '2026-11-15', readTime: '4 min read', summary: 'Early detection of malaria saves lives. Recognize fever symptoms, chills, and fatigue in infants and children.', content: 'Malaria remains a leading public health challenge. Always use insecticide-treated bed nets and seek prompt diagnostic testing (RDT or microscopy) at the onset of fever.', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80' },
  { id: 'art-3', title: 'Healthy Eating on a Budget: Nigerian Superfoods for Heart and Immunity', category: 'Nutrition', author: 'Dr. Ibrahim Musa', date: '2026-11-10', readTime: '6 min read', summary: 'Discover nutritious, locally available foods like local rice, beans, tiger nuts, zobo, and vegetables that boost wellness.', content: 'Eating healthy does not require expensive imported foods. Local vegetables (ugwu, ewedu), beans, sweet potatoes, and fish provide optimal protein, vitamins, and antioxidants.', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80' }
];

let medicalRecords = [
  { id: 'rec-1', patientId: 'u-5', date: '2026-11-10', doctorName: 'Dr. Adebayo Johnson', diagnosis: 'Essential Hypertension (Mild)', notes: 'Patient advised to reduce sodium intake and monitor BP twice weekly.', prescriptions: ['Amlodipine 5mg'] }
];

async function createServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  
  // Auth login/register
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    res.json({ success: true, user });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, role, specialty, hospital, phone } = req.body;
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'Email already registered.' });
    }
    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      role: role || 'patient',
      specialty: specialty || 'General Medicine',
      hospital: hospital || 'Independent',
      verified: role === 'patient', // providers need verification
      phone: phone || '+234 800 000 0000',
      experience: '5 years',
      fee: 10000,
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    };
    users.push(newUser);
    res.json({ success: true, user: newUser });
  });

  // Doctors
  app.get('/api/doctors', (req, res) => {
    const { specialty, search } = req.query;
    let docList = users.filter(u => u.role === 'doctor');
    if (specialty && specialty !== 'All') {
      docList = docList.filter(d => d.specialty?.toLowerCase() === String(specialty).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      docList = docList.filter(d => d.name.toLowerCase().includes(q) || d.specialty?.toLowerCase().includes(q) || d.hospital?.toLowerCase().includes(q));
    }
    res.json(docList);
  });

  app.get('/api/doctors/:id', (req, res) => {
    const doc = users.find(u => u.id === req.params.id && u.role === 'doctor');
    if (!doc) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doc);
  });

  // Hospitals
  app.get('/api/hospitals', (req, res) => {
    res.json(hospitals);
  });

  // Appointments
  app.get('/api/appointments', (req, res) => {
    const { patientId, doctorId } = req.query;
    let list = appointments;
    if (patientId) list = list.filter(a => a.patientId === patientId);
    if (doctorId) list = list.filter(a => a.doctorId === doctorId);
    res.json(list);
  });

  app.post('/api/appointments', (req, res) => {
    const { patientId, patientName, doctorId, doctorName, specialty, date, time, type, fee } = req.body;
    // Validate double booking on backend
    const conflict = appointments.find(a => a.doctorId === doctorId && a.date === date && a.time === time && a.status !== 'cancelled');
    if (conflict) {
      return res.status(400).json({ error: 'This time slot is already booked for the doctor. Please select another time.' });
    }
    const newApt = {
      id: `apt-${Date.now()}`,
      patientId: patientId || 'u-5',
      patientName: patientName || 'Patient Blessing',
      doctorId,
      doctorName,
      specialty,
      date,
      time,
      type: type || 'video',
      status: 'confirmed',
      fee: fee || 10000,
      paid: true,
      notes: 'Scheduled via Medicare Connect.'
    };
    appointments.push(newApt);
    res.json({ success: true, appointment: newApt });
  });

  app.patch('/api/appointments/:id', (req, res) => {
    const { status, notes } = req.body;
    const apt = appointments.find(a => a.id === req.params.id);
    if (!apt) return res.status(404).json({ error: 'Appointment not found' });
    if (status) apt.status = status;
    if (notes) apt.notes = notes;
    res.json({ success: true, appointment: apt });
  });

  // Medical Records
  app.get('/api/medical-records', (req, res) => {
    const { patientId } = req.query;
    let list = medicalRecords;
    if (patientId) list = list.filter(r => r.patientId === patientId);
    res.json(list);
  });

  app.post('/api/medical-records', (req, res) => {
    const { patientId, doctorName, diagnosis, notes, prescriptions: rxList } = req.body;
    const rec = {
      id: `rec-${Date.now()}`,
      patientId: patientId || 'u-5',
      date: new Date().toISOString().split('T')[0],
      doctorName: doctorName || 'Dr. Adebayo Johnson',
      diagnosis,
      notes,
      prescriptions: rxList || []
    };
    medicalRecords.push(rec);
    res.json({ success: true, record: rec });
  });

  // Pharmacy
  app.get('/api/pharmacy/products', (req, res) => {
    const { category, search } = req.query;
    let list = pharmacyProducts;
    if (category && category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    res.json(list);
  });

  app.get('/api/pharmacy/orders', (req, res) => {
    res.json(pharmacyOrders);
  });

  app.post('/api/pharmacy/orders', (req, res) => {
    const { patientId, patientName, items, total, address } = req.body;
    const ord = {
      id: `ord-${Date.now()}`,
      patientId: patientId || 'u-5',
      patientName: patientName || 'Patient Blessing',
      items,
      total,
      status: 'processing',
      address: address || '15 Admiralty Way, Lekki',
      date: new Date().toISOString().split('T')[0]
    };
    pharmacyOrders.push(ord);
    res.json({ success: true, order: ord });
  });

  // Laboratory
  app.get('/api/laboratory/tests', (req, res) => {
    res.json(labTests);
  });

  app.get('/api/laboratory/bookings', (req, res) => {
    res.json(labBookings);
  });

  app.post('/api/laboratory/bookings', (req, res) => {
    const { patientId, patientName, testId, testName, price, date, sampleType } = req.body;
    const lb = {
      id: `lb-${Date.now()}`,
      patientId: patientId || 'u-5',
      patientName: patientName || 'Patient Blessing',
      testId,
      testName,
      price,
      date,
      status: 'pending',
      sampleType: sampleType || 'Home Collection'
    };
    labBookings.push(lb);
    res.json({ success: true, booking: lb });
  });

  app.patch('/api/laboratory/bookings/:id', (req, res) => {
    const { result, status } = req.body;
    const lb = labBookings.find(b => b.id === req.params.id);
    if (!lb) return res.status(404).json({ error: 'Lab booking not found' });
    if (result) lb.result = result;
    if (status) lb.status = status;
    res.json({ success: true, booking: lb });
  });

  // Health Articles
  app.get('/api/articles', (req, res) => {
    res.json(healthArticles);
  });

  app.post('/api/articles', (req, res) => {
    const { title, category, author, summary, content, image } = req.body;
    const art = {
      id: `art-${Date.now()}`,
      title,
      category,
      author: author || 'Dr. Medicare Expert',
      date: new Date().toISOString().split('T')[0],
      readTime: '4 min read',
      summary,
      content,
      image: image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'
    };
    healthArticles.push(art);
    res.json({ success: true, article: art });
  });

  // Admin
  app.get('/api/admin/stats', (req, res) => {
    res.json({
      totalPatients: users.filter(u => u.role === 'patient').length,
      totalDoctors: users.filter(u => u.role === 'doctor').length,
      totalAppointments: appointments.length,
      totalRevenue: appointments.filter(a => a.paid).reduce((sum, a) => sum + (a.fee || 10000), 0) + pharmacyOrders.reduce((sum, o) => sum + o.total, 0),
      pendingVerifications: users.filter(u => u.role === 'doctor' && !u.verified).length,
      totalHospitals: hospitals.length
    });
  });

  app.patch('/api/admin/verify/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.verified = true;
    res.json({ success: true, user });
  });

  // AI Healthcare Assistant using @google/genai
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
      }

      if (!apiKey) {
        return res.json({
          reply: "I am your Medicare Connect AI Health Assistant. (API key not configured). For any urgent medical symptoms or chest pain, please visit the nearest hospital emergency room immediately or contact emergency services."
        });
      }

      const systemInstruction = `You are the Medicare Connect AI Healthcare Assistant. You provide helpful, reliable general health information, wellness advice, symptom triage, and medical specialty recommendations.
IMPORTANT MEDICAL SAFETY RULES:
1. Do not present AI-generated information as a confirmed diagnosis.
2. Do not prescribe medication autonomously.
3. Encourage professional medical evaluation with qualified doctors.
4. If symptoms indicate an emergency (e.g., severe chest pain, breathing difficulty, severe trauma, sudden stroke symptoms), immediately urge the user to visit an emergency room or call emergency services.
5. Be empathetic, professional, and clear.`;

      const contents = [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }] }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
      });

      const reply = response.text || "I recommend consulting with one of our verified specialist doctors on Medicare Connect for an accurate evaluation.";
      res.json({ reply });
    } catch (err: any) {
      console.error('AI Chat Error:', err);
      res.status(500).json({ error: err.message || 'AI Assistant error' });
    }
  });

  // Vite middleware setup in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT || 3000);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Medicare Connect server running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch(console.error);
