import React from 'react';
import { LegalHeroBanner } from '@/components/legal/LegalHeroBanner';
import { SectionBlock } from '@/components/legal/SectionBlock';
import { RelatedPagesStrip } from '@/components/legal/RelatedPagesStrip';
import { ApiStatusCard } from '@/components/legal/ApiStatusCard';
import { disclaimerContent } from '@/content/disclaimer';

const ReportIssueButton = () => (
  <button 
    className="mt-6 border border-f1-red text-f1-red bg-transparent rounded-[8px] px-[20px] py-[10px] font-mono text-[12px] uppercase tracking-widest hover:bg-f1-red hover:text-white transition-colors duration-200 outline-none"
    onClick={() => window.open('https://github.com', '_blank')}
  >
    REPORT AN ISSUE →
  </button>
);

export const DataDisclaimer = () => {
  // Inject custom children into sections
  const sectionsWithCustoms = disclaimerContent.sections.map((section, idx) => {
    // After Section 02 (index 1)
    if (idx === 1) {
      return {
        ...section,
        customChildren: <ApiStatusCard />
      };
    }
    // In Reporting Issues section (last section)
    if (idx === disclaimerContent.sections.length - 1) {
      return {
        ...section,
        customChildren: <ReportIssueButton />
      };
    }
    return section;
  });

  return (
    <div className="w-full bg-[#050508] min-h-screen">
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <LegalHeroBanner 
          pageName="Disclaimer" 
          titleWord1="DATA &" 
          titleWord2="DISCLAIMER" 
          sections={disclaimerContent.sections} 
        />
      </div>

      <div className="w-full max-w-[860px] mx-auto px-[24px] pt-[80px] pb-[80px]">
        {sectionsWithCustoms.map((section, idx) => (
          <SectionBlock 
            key={section.id} 
            section={section} 
            index={idx} 
            isHighlighted={section.isHighlighted}
            isLast={idx === sectionsWithCustoms.length - 1}
          />
        ))}

        <RelatedPagesStrip currentPage="DISCLAIMER" />
      </div>
    </div>
  );
};
