"use client";

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X } from 'lucide-react';

// Define the shape of filter values
export interface Filters {
  availability?: string[];
  gender?: string;
  consultationFee?: number[]; // [min, max] -> using only max here
  experience?: number[]; // [min, max] -> using only min here
  sortBy?: string; // e.g., 'experience_asc', 'fee_desc'
  specialization?: string;
  location?: string;
}

interface FilterSidebarProps {
  initialFilters?: Filters;
  onFilterChange: (newFilters: Filters) => void;
  uniqueSpecializations: string[];
  uniqueLocations: string[];
}

// Predefined filter options (can be fetched or static)
const availabilityOptions = [
  { id: 'mon', label: 'Monday' },
  { id: 'tue', label: 'Tuesday' },
  { id: 'wed', label: 'Wednesday' },
  { id: 'thu', label: 'Thursday' },
  { id: 'fri', label: 'Friday' },
  { id: 'sat', label: 'Saturday' },
  { id: 'sun', label: 'Sunday' },
];

const genderOptions = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  // { id: 'other', label: 'Other' }, // Add if needed
];

const sortOptions = [
    { id: 'name_asc', label: 'Name (A-Z)' },
    { id: 'name_desc', label: 'Name (Z-A)' },
    { id: 'experience_asc', label: 'Experience (Low to High)' },
    { id: 'experience_desc', label: 'Experience (High to Low)' },
    { id: 'fee_asc', label: 'Fee (Low to High)' },
    { id: 'fee_desc', label: 'Fee (High to Low)' },
    { id: 'rating_desc', label: 'Rating (High to Low)' }, // Assuming rating exists
];

const MAX_CONSULTATION_FEE = 1000; // Example max fee
const MAX_EXPERIENCE = 40; // Example max experience

export function FilterSidebar({ initialFilters = {}, onFilterChange, uniqueSpecializations, uniqueLocations }: FilterSidebarProps) {
  const [availability, setAvailability] = React.useState<string[]>(initialFilters.availability || []);
  const [gender, setGender] = React.useState<string | undefined>(initialFilters.gender);
  const [maxFee, setMaxFee] = React.useState<number>(initialFilters.consultationFee?.[0] ?? MAX_CONSULTATION_FEE);
  const [minExperience, setMinExperience] = React.useState<number>(initialFilters.experience?.[0] ?? 0);
  const [sortBy, setSortBy] = React.useState<string | undefined>(initialFilters.sortBy);
  const [specialization, setSpecialization] = React.useState<string | undefined>(initialFilters.specialization);
  const [location, setLocation] = React.useState<string | undefined>(initialFilters.location);


  const handleAvailabilityChange = (dayId: string, checked: boolean | string) => {
    const isChecked = typeof checked === 'boolean' ? checked : checked === 'indeterminate' ? false : true; // Handle 'indeterminate' if necessary
    setAvailability(prev =>
      isChecked ? [...prev, dayId] : prev.filter(day => day !== dayId)
    );
  };

  const handleSortChange = (value: string) => {
    setSortBy(value === 'default' ? undefined : value);
  };

   const handleSpecializationChange = (value: string) => {
    setSpecialization(value === 'all' ? undefined : value);
  };

   const handleLocationChange = (value: string) => {
    setLocation(value === 'all' ? undefined : value);
   };


  const handleApplyFilters = () => {
     const newFilters: Filters = {};
     if (availability.length > 0) newFilters.availability = availability;
     if (gender) newFilters.gender = gender;
     // Only include fee if it's not the max value
     if (maxFee < MAX_CONSULTATION_FEE) newFilters.consultationFee = [maxFee];
     // Only include experience if it's not 0
     if (minExperience > 0) newFilters.experience = [minExperience];
     if (sortBy) newFilters.sortBy = sortBy;
     if (specialization) newFilters.specialization = specialization;
     if (location) newFilters.location = location;

     onFilterChange(newFilters);
   };

   const handleClearFilters = () => {
     setAvailability([]);
     setGender(undefined);
     setMaxFee(MAX_CONSULTATION_FEE);
     setMinExperience(0);
     setSortBy(undefined);
     setSpecialization(undefined);
     setLocation(undefined);
     onFilterChange({}); // Notify parent with empty filters
   };

   // Check if any filters are active
   const areFiltersActive = availability.length > 0 || !!gender || maxFee < MAX_CONSULTATION_FEE || minExperience > 0 || !!sortBy || !!specialization || !!location;


  return (
    <Card className="sticky top-20 h-[calc(100vh-6rem)] overflow-hidden"> {/* Adjust top based on header height */}
       <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <CardTitle className="text-lg font-semibold">Filters</CardTitle>
         {areFiltersActive && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-sm text-primary hover:bg-primary/10">
                <X className="mr-1 h-4 w-4" /> Clear All
            </Button>
         )}
      </CardHeader>
      <ScrollArea className="h-[calc(100%-120px)]"> {/* Adjust height based on header/footer */}
         <CardContent className="p-4">
           <Accordion type="multiple" defaultValue={['availability', 'sortBy', 'specialization', 'location', 'gender', 'fee', 'experience']} className="w-full">

             {/* Sort By */}
             <AccordionItem value="sortBy">
               <AccordionTrigger className="text-base font-medium">Sort By</AccordionTrigger>
               <AccordionContent>
                 <RadioGroup value={sortBy || 'default'} onValueChange={handleSortChange} className="space-y-2">
                   {sortOptions.map(option => (
                     <div key={option.id} className="flex items-center space-x-2">
                       <RadioGroupItem value={option.id} id={`sort-${option.id}`} />
                       <Label htmlFor={`sort-${option.id}`} className="font-normal">{option.label}</Label>
                     </div>
                   ))}
                 </RadioGroup>
               </AccordionContent>
             </AccordionItem>

             {/* Specialization */}
             <AccordionItem value="specialization">
               <AccordionTrigger className="text-base font-medium">Specialization</AccordionTrigger>
               <AccordionContent>
                 <RadioGroup value={specialization || 'all'} onValueChange={handleSpecializationChange} className="space-y-2">
                     <div className="flex items-center space-x-2">
                           <RadioGroupItem value="all" id="spec-all" />
                           <Label htmlFor="spec-all" className="font-normal">All Specializations</Label>
                       </div>
                   {uniqueSpecializations.map(spec => (
                     <div key={spec} className="flex items-center space-x-2">
                       <RadioGroupItem value={spec} id={`spec-${spec}`} />
                       <Label htmlFor={`spec-${spec}`} className="font-normal">{spec}</Label>
                     </div>
                   ))}
                 </RadioGroup>
               </AccordionContent>
             </AccordionItem>

              {/* Location */}
             <AccordionItem value="location">
               <AccordionTrigger className="text-base font-medium">Location</AccordionTrigger>
               <AccordionContent>
                 <RadioGroup value={location || 'all'} onValueChange={handleLocationChange} className="space-y-2">
                     <div className="flex items-center space-x-2">
                           <RadioGroupItem value="all" id="loc-all" />
                           <Label htmlFor="loc-all" className="font-normal">All Locations</Label>
                       </div>
                   {uniqueLocations.map(loc => (
                     <div key={loc} className="flex items-center space-x-2">
                       <RadioGroupItem value={loc} id={`loc-${loc}`} />
                       <Label htmlFor={`loc-${loc}`} className="font-normal">{loc}</Label>
                     </div>
                   ))}
                 </RadioGroup>
               </AccordionContent>
             </AccordionItem>


             {/* Availability */}
             <AccordionItem value="availability">
               <AccordionTrigger className="text-base font-medium">Availability</AccordionTrigger>
               <AccordionContent>
                 <div className="space-y-2">
                   {availabilityOptions.map(option => (
                     <div key={option.id} className="flex items-center space-x-2">
                       <Checkbox
                         id={`avail-${option.id}`}
                         checked={availability.includes(option.id)}
                         onCheckedChange={(checked) => handleAvailabilityChange(option.id, checked)}
                       />
                       <Label htmlFor={`avail-${option.id}`} className="font-normal">{option.label}</Label>
                     </div>
                   ))}
                 </div>
               </AccordionContent>
             </AccordionItem>

             {/* Gender */}
             <AccordionItem value="gender">
               <AccordionTrigger className="text-base font-medium">Gender</AccordionTrigger>
               <AccordionContent>
                 <RadioGroup value={gender} onValueChange={setGender} className="space-y-2">
                   {genderOptions.map(option => (
                     <div key={option.id} className="flex items-center space-x-2">
                       <RadioGroupItem value={option.id} id={`gender-${option.id}`} />
                       <Label htmlFor={`gender-${option.id}`} className="font-normal">{option.label}</Label>
                     </div>
                   ))}
                 </RadioGroup>
               </AccordionContent>
             </AccordionItem>

             {/* Consultation Fee */}
             <AccordionItem value="fee">
               <AccordionTrigger className="text-base font-medium">Consultation Fee</AccordionTrigger>
               <AccordionContent>
                 <div className="space-y-4">
                    <Slider
                        value={[maxFee]}
                        onValueChange={(value) => setMaxFee(value[0])}
                        max={MAX_CONSULTATION_FEE}
                        step={50}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                          <span>₹0</span>
                          <span>₹{maxFee}{maxFee === MAX_CONSULTATION_FEE ? '+' : ''}</span>
                      </div>
                 </div>

               </AccordionContent>
             </AccordionItem>

              {/* Experience */}
             <AccordionItem value="experience">
               <AccordionTrigger className="text-base font-medium">Years of Experience</AccordionTrigger>
               <AccordionContent>
                 <div className="space-y-4">
                     <Slider
                       value={[minExperience]}
                       onValueChange={(value) => setMinExperience(value[0])}
                       max={MAX_EXPERIENCE}
                       step={1}
                       className="w-full"
                     />
                      <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{minExperience} Years{minExperience === MAX_EXPERIENCE ? '+' : ''}</span>
                           <span>{MAX_EXPERIENCE} Years</span>
                      </div>
                 </div>
               </AccordionContent>
             </AccordionItem>


           </Accordion>
         </CardContent>
      </ScrollArea>
       <div className="border-t p-4">
           <Button onClick={handleApplyFilters} className="w-full bg-accent hover:bg-accent/90">Apply Filters</Button>
       </div>
    </Card>
  );
}
