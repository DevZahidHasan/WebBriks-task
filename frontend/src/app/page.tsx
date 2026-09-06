'use client';

import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { InteractivePreview } from '../components/landing/InteractivePreview';
import { EngineeringPillars } from '../components/landing/EngineeringPillars';
import { Footer } from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <InteractivePreview />
        <EngineeringPillars />
      </main>
      <Footer />
    </div>
  );
}
