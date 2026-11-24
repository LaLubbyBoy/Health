export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'pharmacist' | 'lab_provider' | 'hospital_admin' | 'admin' | 'nurse';
  specialty?: string;
  hospital?: string;
  verified?: boolean;
  phone?: string;
  experience?: string;
  fee?: number;
  rating?: number;
  avatar?: string;
  address?: string;
  pharmacyName?: string;
  labName?: string;
  hospitalName?: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  role: string;
  specialty: string;
  hospital: string;
  verified: boolean;
  phone: string;
  experience: string;
  fee: number;
  rating: number;
  avatar: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  type: string;
  emergency: boolean;
  phone: string;
  services: string[];
  rating: number;
  image: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'video' | 'in-person' | 'audio' | 'follow-up';
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';
  fee: number;
  paid: boolean;
  notes: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medications: { name: string; dosage: string; duration: string }[];
  status: string;
  notes: string;
}

export interface PharmacyProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
  image: string;
  rxRequired: boolean;
}

export interface PharmacyOrder {
  id: string;
  patientId: string;
  patientName: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  total: number;
  status: string;
  address: string;
  date: string;
}

export interface LabTest {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  turnaround: string;
}

export interface LabBooking {
  id: string;
  patientId: string;
  patientName: string;
  testId: string;
  testName: string;
  price: number;
  date: string;
  status: string;
  sampleType: string;
  result?: string;
}

export interface HealthArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  image: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  notes: string;
  prescriptions: string[];
}
