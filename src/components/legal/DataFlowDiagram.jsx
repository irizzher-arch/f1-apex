import React from 'react';

export const DataFlowDiagram = () => {
  return (
    <div className="mb-12">
      <span className="font-mono text-[10px] text-f1-red tracking-widest uppercase mb-4 inline-block">
        Data Flow Architecture
      </span>
      
      <style>{`
        @keyframes dashFlowHorizontal {
          to { stroke-dashoffset: -20; }
        }
        @keyframes dashFlowVertical {
          to { stroke-dashoffset: -20; }
        }
      `}</style>
      
      {/* Desktop View (Horizontal) */}
      <div className="hidden md:flex items-center justify-between bg-white/[0.02] border border-white/[0.05] rounded-[16px] p-[32px] relative w-full h-[120px]">
        
        {/* Animated Dashed Line Background */}
        <svg className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 z-0 pointer-events-none px-[60px]" style={{ overflow: 'visible' }}>
          <line 
            x1="40" y1="0" x2="calc(100% - 40px)" y2="0" 
            stroke="#E8002D" strokeWidth="2" strokeDasharray="6 4"
            style={{ animation: 'dashFlowHorizontal 1.5s linear infinite' }}
          />
        </svg>

        {/* Nodes */}
        <div className="z-10 bg-[#000000] border border-f1-red rounded-full px-[24px] py-[12px] shadow-[0_0_15px_rgba(232,0,45,0.2)]">
          <span className="font-mono text-[13px] text-white whitespace-nowrap">USER</span>
        </div>
        
        <div className="z-10 bg-[#000000] border border-f1-red rounded-full px-[24px] py-[12px] shadow-[0_0_15px_rgba(232,0,45,0.2)]">
          <span className="font-mono text-[13px] text-white whitespace-nowrap">APEX DASHBOARD</span>
        </div>

        <div className="z-10 bg-[#000000] border border-f1-red rounded-full px-[24px] py-[12px] shadow-[0_0_15px_rgba(232,0,45,0.2)]">
          <span className="font-mono text-[13px] text-white whitespace-nowrap">ERGAST API</span>
        </div>

        <div className="z-10 bg-[#000000] border border-f1-red rounded-full px-[24px] py-[12px] shadow-[0_0_15px_rgba(232,0,45,0.2)]">
          <span className="font-mono text-[13px] text-white whitespace-nowrap">OPENF1 API</span>
        </div>
      </div>

      {/* Mobile View (Vertical) */}
      <div className="flex md:hidden flex-col items-center gap-8 bg-white/[0.02] border border-white/[0.05] rounded-[16px] p-[40px] relative">
        <svg className="absolute top-[60px] left-1/2 w-[2px] h-[calc(100%-120px)] -translate-x-1/2 z-0 pointer-events-none" style={{ overflow: 'visible' }}>
          <line 
            x1="0" y1="0" x2="0" y2="100%" 
            stroke="#E8002D" strokeWidth="2" strokeDasharray="6 4"
            style={{ animation: 'dashFlowVertical 1.5s linear infinite' }}
          />
        </svg>
        
        <div className="z-10 bg-[#000000] border border-f1-red rounded-full px-[24px] py-[12px] shadow-[0_0_15px_rgba(232,0,45,0.2)]">
          <span className="font-mono text-[13px] text-white text-center block">USER</span>
        </div>
        
        <div className="z-10 bg-[#000000] border border-f1-red rounded-full px-[24px] py-[12px] shadow-[0_0_15px_rgba(232,0,45,0.2)]">
          <span className="font-mono text-[13px] text-white text-center block">APEX DASHBOARD</span>
        </div>

        <div className="z-10 bg-[#000000] border border-f1-red rounded-full px-[24px] py-[12px] shadow-[0_0_15px_rgba(232,0,45,0.2)]">
          <span className="font-mono text-[13px] text-white text-center block">ERGAST API</span>
        </div>

        <div className="z-10 bg-[#000000] border border-f1-red rounded-full px-[24px] py-[12px] shadow-[0_0_15px_rgba(232,0,45,0.2)]">
          <span className="font-mono text-[13px] text-white text-center block">OPENF1 API</span>
        </div>
      </div>
    </div>
  );
};
