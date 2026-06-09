import React from 'react';
import { useStore } from '@/store/useStore';

export const ShareExportStrip = () => {
  const { h2h } = useStore();
  const { driver1Id, driver2Id, season } = h2h;

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('d1', driver1Id);
    url.searchParams.set('d2', driver2Id);
    url.searchParams.set('year', season);
    navigator.clipboard.writeText(url.toString());
    alert('Link copied to clipboard!');
  };

  const handleScreenshot = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById('h2h-export-area');
      if (!element) return;
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#050508',
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `APEX_H2H_${driver1Id}_vs_${driver2Id}_${season}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Screenshot failed', err);
    }
  };

  const handleShareX = () => {
    const text = `${driver1Id.toUpperCase()} vs ${driver2Id.toUpperCase()} ${season} Season. Compare head-to-head stats on APEX F1 Dashboard! #F1 #APEX`;
    const url = new URL(window.location.href);
    url.searchParams.set('d1', driver1Id);
    url.searchParams.set('d2', driver2Id);
    url.searchParams.set('year', season);
    
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url.toString())}`, '_blank');
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-24 mb-12 px-6 flex flex-col items-center gap-4">
      <div className="text-[10px] font-heading text-white/40 uppercase tracking-widest">Share This Comparison</div>
      <div className="flex gap-4">
        <button 
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-mono uppercase tracking-widest hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all"
        >
          <span>🔗</span> Copy Link
        </button>
        <button 
          onClick={handleScreenshot}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-f1-red/10 border border-f1-red/30 text-f1-red text-[11px] font-mono uppercase tracking-widest hover:bg-f1-red/20 hover:shadow-[0_0_15px_rgba(232,0,45,0.3)] transition-all"
        >
          <span>📸</span> Screenshot
        </button>
        <button 
          onClick={handleShareX}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 text-[#1DA1F2] text-[11px] font-mono uppercase tracking-widest hover:bg-[#1DA1F2]/20 hover:shadow-[0_0_15px_rgba(29,161,242,0.3)] transition-all"
        >
          <span>𝕏</span> Share on X
        </button>
      </div>
    </div>
  );
};
