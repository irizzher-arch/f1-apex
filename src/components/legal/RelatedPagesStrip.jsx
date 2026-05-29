import React from 'react';
import { useStore } from '@/store/useStore';
import { Shield, FileText, Database, ArrowRight } from 'lucide-react';

export const RelatedPagesStrip = ({ currentPage }) => {
  const setActiveTab = useStore(state => state.setActiveTab);

  const pages = [
    { id: 'PRIVACY', title: 'Privacy Policy', icon: Shield },
    { id: 'TERMS', title: 'Terms of Service', icon: FileText },
    { id: 'DISCLAIMER', title: 'Data Disclaimer', icon: Database }
  ];

  return (
    <div className="w-full bg-white/[0.03] border border-white/[0.07] rounded-[14px] p-[28px] md:p-[32px] mt-16 mb-24 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="shrink-0 pt-2">
          <span className="font-mono text-[10px] text-f1-red uppercase tracking-widest">
            Also Read
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row w-full gap-4">
          {pages.map(page => {
            const isCurrent = page.id === currentPage;
            const Icon = page.icon;
            
            return (
              <button
                key={page.id}
                onClick={() => {
                  if (!isCurrent) {
                    setActiveTab(page.id);
                    window.scrollTo(0,0);
                  }
                }}
                className={`
                  flex-1 flex flex-col items-start text-left bg-white/[0.04] rounded-[10px] p-[16px] md:p-[20px] 
                  transition-all duration-200 outline-none relative group
                  ${isCurrent 
                    ? 'border border-f1-red/50 cursor-default opacity-80' 
                    : 'border border-transparent hover:border-f1-red/30 hover:-translate-y-[2px] cursor-pointer'}
                `}
              >
                <Icon size={18} className="text-white/40 mb-4" />
                <span className="font-heading font-[700] text-[16px] text-white uppercase tracking-wide">
                  {page.title}
                </span>
                
                {!isCurrent && (
                  <ArrowRight size={14} className="text-f1-red absolute bottom-[20px] right-[20px] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
