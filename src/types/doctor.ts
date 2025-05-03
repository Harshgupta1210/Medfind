export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number; // years
  languages: string[];
  location: string; // City or area
  availability: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]; // Days available
  consultationFee: number;
  imageUrl: string;
  clinicName?: string; // Optional clinic name
  rating?: number; // Optional rating (e.g., out of 5)
  reviews?: number; // Optional number of reviews
  gender?: 'male' | 'female' | 'other';
  qualifications?: string; // e.g., MBBS, MD
}
