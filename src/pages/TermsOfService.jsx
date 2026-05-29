import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { LegalHeroBanner } from '@/components/legal/LegalHeroBanner';
import { SectionBlock } from '@/components/legal/SectionBlock';
import { RelatedPagesStrip } from '@/components/legal/RelatedPagesStrip';
import { termsContent } from '@/content/terms';

export const TermsOfService = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="w-full bg-[#050508] min-h-screen">
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <LegalHeroBanner 
          pageName="Terms" 
          titleWord1="TERMS OF" 
          titleWord2="SERVICE" 
          sections={termsContent.sections} 
        />
      </div>

      <div className="w-full max-w-[860px] mx-auto px-[24px] pt-[80px] pb-[80px]">
        
        {/* Acceptance Banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, height: 0, marginBottom: 0, overflow: 'hidden' }}
              transition={{ duration: 0.4 }}
              className="w-full bg-[#E8002D]/[0.07] border border-[#E8002D]/25 rounded-[14px] p-[20px] md:p-[28px] mb-12 flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              <div className="shrink-0 mt-1 md:mt-0">
                <AlertTriangle size={22} className="text-f1-red" />
              </div>
              <div className="flex-1">
                <p className="font-body text-[14px] text-white/80 leading-[1.6] m-0">
                  By accessing APEX, you agree to these terms. This is an unofficial fan-built project and is not affiliated with, endorsed by, or associated with Formula 1, FIA, or any F1 team.
                </p>
              </div>
              <button 
                onClick={() => setShowBanner(false)}
                className="shrink-0 bg-f1-red hover:bg-[#ff1a43] text-white rounded-[8px] px-4 py-2 font-mono text-[12px] uppercase tracking-wide transition-colors outline-none whitespace-nowrap"
              >
                I UNDERSTAND →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {termsContent.sections.map((section, idx) => (
          <SectionBlock 
            key={section.id} 
            section={section} 
            index={idx} 
            isHighlighted={section.isHighlighted}
            isLast={idx === termsContent.sections.length - 1}
          />
        ))}

        <RelatedPagesStrip currentPage="TERMS" />
      </div>
    </div>
  );
};
