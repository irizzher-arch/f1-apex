import React from 'react';
import { useStore } from '@/store/useStore';
import { Navbar } from '@/components/layout/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { LiveTiming } from '@/pages/LiveTiming';
import { Standings } from '@/pages/Standings';
import { Schedule } from '@/pages/Schedule';
import { Results } from '@/pages/Results';
import { HeadToHead } from '@/pages/HeadToHead';
import { RacePace } from '@/pages/RacePace';
import { PitStops } from '@/pages/PitStops';
import { Home } from '@/pages/Home';
import { Footer } from '@/components/layout/Footer';

import { PrivacyPolicy } from '@/pages/PrivacyPolicy';
import { TermsOfService } from '@/pages/TermsOfService';
import { DataDisclaimer } from '@/pages/DataDisclaimer';

// Placeholders for other pages
const Placeholder = ({ title }) => (
  <div className="f1-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
    <h2 className="text-2xl font-heading font-bold text-white mb-4 uppercase tracking-widest">{title}</h2>
    <p className="text-text-secondary font-mono">This feature is currently under development.</p>
  </div>
);

export const Dashboard = () => {
  const { activeTab } = useStore((state) => state.ui);

  const renderContent = () => {
    switch (activeTab) {
      case 'LIVE':
        return <LiveTiming />;
      case 'HOME':
        return <Home />;
      case 'SCHEDULE':
        return <Schedule />;
      case 'RESULTS':
        return <Results />;
      case 'STANDINGS':
        return <Standings />;
      case 'H2H':
        return <HeadToHead />;
      case 'PACE':
        return <RacePace />;
      case 'PITS':
        return <PitStops />;
      case 'PRIVACY':
        return <PrivacyPolicy />;
      case 'TERMS':
        return <TermsOfService />;
      case 'DISCLAIMER':
        return <DataDisclaimer />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-text-primary overflow-x-hidden flex flex-col relative">
      {/* Subtle Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ transform: 'translateZ(0)' }}>
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-f1-red/5 blur-[80px] animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-white/5 blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[30%] w-[50vw] h-[50vw] rounded-full bg-f1-red/5 blur-[80px] animate-blob animation-delay-4000" />
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 20s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <Navbar />
      <main className={`flex-1 w-full ${activeTab === 'HOME' ? 'pt-0' : 'pt-[70px]'} relative z-20`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

