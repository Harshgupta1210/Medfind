import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo/Brand Name */}
        <Link href="/doctors" className="text-2xl font-bold">
          MediFind
        </Link>

        {/* Desktop Navigation & Search (Hidden on mobile) */}
        <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {/* Location Input (Placeholder) */}
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Location"
              className="w-48 rounded-l-md border-r-0 bg-background pl-10 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled // Placeholder, not functional
            />
             <Button variant="secondary" className="rounded-l-none" disabled>
               Detect
             </Button>
          </div>


          {/* Search Input (Placeholder) */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search doctors, specialities..."
              className="w-96 rounded-md bg-background pl-10 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled // Placeholder, not functional
            />
          </div>

          {/* Navigation Links (Placeholders) */}
          <nav className="flex items-center gap-4">
             <Button variant="link" className="text-primary-foreground" disabled>Doctors</Button>
             <Button variant="link" className="text-primary-foreground" disabled>Pharmacy</Button>
             <Button variant="link" className="text-primary-foreground" disabled>Lab Tests</Button>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-primary hover:bg-primary/90 border-primary-foreground text-primary-foreground" disabled>Login</Button>
          {/* Mobile Menu Trigger (if needed later) */}
          {/* <Button variant="ghost" size="icon" className="md:hidden">
             <Menu className="h-6 w-6" />
             <span className="sr-only">Toggle menu</span>
           </Button> */}
        </div>
      </div>
       {/* Mobile Search Bar (Hidden on Desktop) - Optional placeholder */}
       <div className="container mx-auto px-4 pb-2 md:hidden">
          <div className="relative flex items-center">
             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
             <Input
               type="search"
               placeholder="Search doctors, specialities..."
               className="w-full rounded-md bg-background pl-10 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
               disabled // Placeholder, not functional
             />
           </div>
       </div>
    </header>
  );
}
