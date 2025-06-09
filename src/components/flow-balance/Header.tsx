import { Droplets } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center">
        <Droplets className="h-8 w-8 mr-3" />
        <h1 className="text-2xl font-bold font-headline">FlowBalance</h1>
      </div>
    </header>
  );
}
