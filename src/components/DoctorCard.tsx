import Image from 'next/image';
import type { Doctor } from '@/types/doctor';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Languages, MapPin, Star, Stethoscope, User, Wallet } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-lg md:flex-row">
      {/* Image Section */}
      <div className="relative h-48 w-full flex-shrink-0 md:h-auto md:w-48">
        <Image
          src={doctor.imageUrl || "https://picsum.photos/200/200?random=99"} // Fallback image
          alt={`Dr. ${doctor.name}`}
          layout="fill"
          objectFit="cover"
          data-ai-hint="doctor portrait professional"
          className="rounded-l-lg"
        />
         {doctor.rating && (
            <Badge variant="default" className="absolute bottom-2 right-2 bg-primary text-primary-foreground">
               <Star className="mr-1 h-3 w-3 fill-current" /> {doctor.rating.toFixed(1)} ({doctor.reviews || 0})
            </Badge>
         )}
      </div>

      {/* Details Section */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-xl font-semibold">{`Dr. ${doctor.name}`}</CardTitle>
            <p className="text-sm text-muted-foreground">{doctor.qualifications || ''}</p>
          </CardHeader>

          <CardContent className="space-y-2 p-0 pb-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Stethoscope className="h-4 w-4 text-primary" />
              <span>{doctor.specialization}</span>
            </div>
             <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 text-primary" />
              <span>{doctor.experience} years experience</span>
            </div>
             {doctor.clinicName && (
                 <div className="flex items-center gap-2 text-muted-foreground">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> {/* Simple building/clinic icon */}
                     <span>{doctor.clinicName}</span>
                 </div>
             )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{doctor.location}</span>
            </div>
             <div className="flex items-center gap-2 text-muted-foreground">
                <Languages className="h-4 w-4 text-primary" />
                <span>{doctor.languages.join(', ')}</span>
            </div>
             <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">₹{doctor.consultationFee} Consultation fee</span>
            </div>

          </CardContent>
        </div>

        <CardFooter className="flex flex-col items-stretch gap-2 p-0 md:flex-row md:justify-between">
             <div className="flex items-center gap-2">
               <Calendar className="h-4 w-4 text-accent" />
               <span className="text-sm font-medium text-accent">
                 Available: {doctor.availability.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
               </span>
             </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>View Profile</Button>
            <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90" disabled>Book Clinic Visit</Button>
             {/* <Button variant="secondary" size="sm" disabled>Video Consult</Button> */}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
