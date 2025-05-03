"use client"; // This page needs client-side interaction for filters and pagination

import * as React from 'react';
import type { Doctor } from '@/types/doctor';
import { Header } from '@/components/Header';
import { FilterSidebar, type Filters } from '@/components/FilterSidebar';
import { DoctorCard } from '@/components/DoctorCard';
import { PaginationControls } from '@/components/PaginationControls';
import { Skeleton } from '@/components/ui/skeleton';

interface DoctorsApiResponse {
  doctors: Doctor[];
  currentPage: number;
  totalPages: number;
  totalDoctors: number;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalDoctors, setTotalDoctors] = React.useState(0);
  const [filters, setFilters] = React.useState<Filters>({});
  const [uniqueSpecializations, setUniqueSpecializations] = React.useState<string[]>([]);
  const [uniqueLocations, setUniqueLocations] = React.useState<string[]>([]);

  const fetchDoctors = React.useCallback(async (page: number, currentFilters: Filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '6', // Doctors per page
      });

      // Append filter parameters
      if (currentFilters.specialization) params.append('specialization', currentFilters.specialization);
      if (currentFilters.location) params.append('location', currentFilters.location);
      if (currentFilters.availability && currentFilters.availability.length > 0) params.append('availability', currentFilters.availability.join(','));
      if (currentFilters.gender) params.append('gender', currentFilters.gender);
      if (currentFilters.experience?.[0]) params.append('minExperience', currentFilters.experience[0].toString());
      if (currentFilters.consultationFee?.[0]) params.append('maxFee', currentFilters.consultationFee[0].toString());

      // Append sorting parameters
       if (currentFilters.sortBy) {
           const [sortByField, sortOrder] = currentFilters.sortBy.split('_');
           if (sortByField && sortOrder) {
                params.append('sortBy', sortByField);
                params.append('sortOrder', sortOrder);
           }
       } else {
           // Default sort if none provided by filter
           params.append('sortBy', 'name');
           params.append('sortOrder', 'asc');
       }


      const response = await fetch(`/api/doctors?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data: DoctorsApiResponse = await response.json();

      setDoctors(data.doctors);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalDoctors(data.totalDoctors);

      // Fetch unique values only once or when necessary
      if (uniqueSpecializations.length === 0 || uniqueLocations.length === 0) {
          fetchUniqueFilterValues();
      }

    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setDoctors([]); // Clear doctors on error
    } finally {
      setIsLoading(false);
    }
  }, [uniqueSpecializations.length, uniqueLocations.length]); // Added dependencies


    // Function to fetch unique specialization and location values (only for filter options)
   const fetchUniqueFilterValues = async () => {
     try {
       // Fetch *all* doctors without pagination/filters just to get unique values
       // In a real DB scenario, you'd query distinct values.
       const response = await fetch('/api/doctors?limit=1000'); // Fetch a large number
       if (!response.ok) throw new Error('Failed to fetch base data for filters');
       const data: DoctorsApiResponse = await response.json();

       const specs = Array.from(new Set(data.doctors.map(doc => doc.specialization))).sort();
       const locs = Array.from(new Set(data.doctors.map(doc => doc.location))).sort();

       setUniqueSpecializations(specs);
       setUniqueLocations(locs);
     } catch (err) {
       console.error("Failed to fetch unique filter values:", err);
       // Handle error appropriately, maybe show a message
     }
   };


  // Initial fetch and fetch on filter change
  React.useEffect(() => {
    fetchDoctors(1, filters); // Fetch page 1 when filters change
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); // Removed fetchDoctors from dependency array as it causes infinite loop with useCallback

  const handlePageChange = (newPage: number) => {
    fetchDoctors(newPage, filters);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    // Fetching is handled by the useEffect hook watching `filters`
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="container mx-auto flex-1 px-4 py-6 md:px-6 md:py-8">
        {/* Optional Breadcrumbs or Title */}
         <h1 className="mb-4 text-2xl font-semibold text-primary">Find General Physicians / Internal Medicine Doctors</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
                onFilterChange={handleFilterChange}
                initialFilters={filters}
                uniqueSpecializations={uniqueSpecializations}
                uniqueLocations={uniqueLocations}
             />
          </div>

          {/* Doctor Listing Area */}
          <div className="lg:col-span-3">
            {error && (
              <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-center text-destructive">
                Error loading doctors: {error}. Please try again later.
              </div>
            )}

            {/* Loading Skeletons */}
            {isLoading && (
              <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                  <Skeleton key={index} className="h-48 w-full rounded-lg" />
                ))}
              </div>
            )}

            {/* Doctor Cards */}
            {!isLoading && !error && doctors.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{totalDoctors} doctors found</p>
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}

            {/* No Doctors Found Message */}
            {!isLoading && !error && doctors.length === 0 && (
              <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed bg-card p-6 text-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mb-4 h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 4a9 9 0 11-18 0 9 9 0 0118 0z" /> {/* Simplified no results icon */}
                 </svg>
                 <p className="text-lg font-medium">No Doctors Found</p>
                 <p className="text-sm text-muted-foreground">Try adjusting your filters or search criteria.</p>
               </div>
            )}

            {/* Pagination */}
            {!isLoading && !error && totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
       {/* Simple Footer */}
        <footer className="mt-auto border-t bg-secondary py-4 text-center text-sm text-secondary-foreground">
             © {new Date().getFullYear()} MediFind. All rights reserved. (Demo Clone)
        </footer>
    </div>
  );
}
