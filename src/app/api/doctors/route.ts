import { type NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { Doctor } from '@/types/doctor';
import { z } from 'zod';

const doctorsFilePath = path.join(process.cwd(), 'src', 'data', 'doctors.json');

// Helper function to read doctors data
async function getDoctors(): Promise<Doctor[]> {
  try {
    const data = await readFile(doctorsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading doctors file:', error);
    throw new Error('Could not read doctor data');
  }
}

// Helper function to write doctors data
async function saveDoctors(doctors: Doctor[]): Promise<void> {
  try {
    await writeFile(doctorsFilePath, JSON.stringify(doctors, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing doctors file:', error);
    throw new Error('Could not save doctor data');
  }
}

// Zod schema for doctor validation (POST)
const doctorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  experience: z.number().int().min(0, "Experience must be non-negative"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  location: z.string().min(1, "Location is required"),
  availability: z.array(z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])).min(1, "At least one availability day is required"),
  consultationFee: z.number().min(0, "Consultation fee must be non-negative"),
  imageUrl: z.string().url("Image URL must be a valid URL"),
  clinicName: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().int().min(0).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  qualifications: z.string().optional(),
});


// GET /api/doctors - List doctors with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const doctors = await getDoctors();
    const { searchParams } = new URL(request.url);

    // Filters
    const specialization = searchParams.get('specialization');
    const location = searchParams.get('location');
    const availability = searchParams.get('availability')?.split(','); // Expect comma-separated days e.g., mon,tue
    const gender = searchParams.get('gender');
    const minExperience = searchParams.get('minExperience');
    const maxFee = searchParams.get('maxFee');

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'name'; // Default sort by name
    const sortOrder = searchParams.get('sortOrder') || 'asc'; // Default sort order asc

    // Pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10); // Default limit 6 doctors per page

    let filteredDoctors = doctors;

    // Apply filters
    if (specialization) {
      filteredDoctors = filteredDoctors.filter(doc =>
        doc.specialization.toLowerCase().includes(specialization.toLowerCase())
      );
    }
    if (location) {
      filteredDoctors = filteredDoctors.filter(doc =>
        doc.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (availability && availability.length > 0) {
        filteredDoctors = filteredDoctors.filter(doc =>
            availability.every(day => doc.availability.includes(day as any)) // Check if doctor is available on ALL specified days
        );
    }
     if (gender) {
      filteredDoctors = filteredDoctors.filter(doc => doc.gender === gender);
    }
     if (minExperience) {
       const exp = parseInt(minExperience, 10);
       if (!isNaN(exp)) {
         filteredDoctors = filteredDoctors.filter(doc => doc.experience >= exp);
       }
    }
    if (maxFee) {
       const fee = parseInt(maxFee, 10);
       if (!isNaN(fee)) {
         filteredDoctors = filteredDoctors.filter(doc => doc.consultationFee <= fee);
       }
    }


    // Apply sorting
    filteredDoctors.sort((a, b) => {
       let valA = a[sortBy as keyof Doctor];
       let valB = b[sortBy as keyof Doctor];

       // Handle different types for sorting
       if (typeof valA === 'string' && typeof valB === 'string') {
         valA = valA.toLowerCase();
         valB = valB.toLowerCase();
       }

       if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
       if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
       return 0;
     });


    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);

    const totalDoctors = filteredDoctors.length;
    const totalPages = Math.ceil(totalDoctors / limit);

    return NextResponse.json({
      doctors: paginatedDoctors,
      currentPage: page,
      totalPages: totalPages,
      totalDoctors: totalDoctors,
    });

  } catch (error) {
    console.error("GET /api/doctors Error:", error);
    return NextResponse.json({ message: 'Failed to fetch doctors', error: (error as Error).message }, { status: 500 });
  }
}


// POST /api/doctors - Add a new doctor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = doctorSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ message: 'Invalid doctor data', errors: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }

    const newDoctorData = validationResult.data;
    const doctors = await getDoctors();

    const newDoctor: Doctor = {
      ...newDoctorData,
      id: `doc${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // Generate a unique ID
    };

    doctors.push(newDoctor);
    await saveDoctors(doctors);

    return NextResponse.json(newDoctor, { status: 201 });

  } catch (error) {
     console.error("POST /api/doctors Error:", error);
     // Handle JSON parsing error specifically
     if (error instanceof SyntaxError) {
         return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
     }
     return NextResponse.json({ message: 'Failed to add doctor', error: (error as Error).message }, { status: 500 });
  }
}
