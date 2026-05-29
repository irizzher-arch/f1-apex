import React from 'react';
import { LegalHeroBanner } from '@/components/legal/LegalHeroBanner';
import { SectionBlock } from '@/components/legal/SectionBlock';
import { RelatedPagesStrip } from '@/components/legal/RelatedPagesStrip';
import { DataFlowDiagram } from '@/components/legal/DataFlowDiagram';
import { privacyContent } from '@/content/privacy';

export const PrivacyPolicy = () => {
  // Inject the custom diagram after section 02 (index 1)
  const sectionsWithCustoms = privacyContent.sections.map((section, idx) => {
    if (idx === 1) {
      return {
        ...section,
        customChildren: <DataFlowDiagram />
      };
    }
    return section;
  });

  return (
    <div className="w-full bg-[#050508] min-h-screen">
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <LegalHeroBanner 
          pageName="Privacy" 
          titleWord1="PRIVACY" 
          titleWord2="POLICY" 
          sections={privacyContent.sections} 
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

        <RelatedPagesStrip currentPage="PRIVACY" />
      </div>
    </div>
  );
};
