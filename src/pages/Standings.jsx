import React, { useEffect, useState } from 'react';
import { useErgast } from '@/hooks/useErgast';
import { useStore } from '@/store/useStore';
import { teamColors } from '@/utils/teamColors';

export const Standings = () => {
  const { session } = useStore();
  const { fetchStandings, loading } = useErgast();
  const [standings, setStandings] = useState({ drivers: [], constructors: [] });
  const [view, setView] = useState('drivers');

  useEffect(() => {
    fetchStandings(session.year).then(setStandings);
  }, [session.year, fetchStandings]);

  if (loading) {
    return <div className="text-f1-red text-center py-20 font-mono animate-pulse">Loading Standings Data...</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <div className="relative w-full h-[200px] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <img 
          src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/88a4f7245443887.69ae60efe0c1c.png" 
          className="w-full h-full object-cover opacity-70" 
          alt="Standings Header"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-base via-transparent to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <h1 className="text-4xl font-heading font-bold uppercase tracking-widest !m-0 drop-shadow-lg">
            {session.year} Championship
          </h1>
          <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10 backdrop-blur-md">
            <button 
              onClick={() => setView('drivers')}
              className={`px-6 py-2 rounded font-heading font-bold uppercase transition-all ${view === 'drivers' ? 'bg-f1-red text-white shadow-lg shadow-f1-red/20' : 'text-text-secondary hover:text-white'}`}
            >
              Drivers
            </button>
            <button 
              onClick={() => setView('constructors')}
              className={`px-6 py-2 rounded font-heading font-bold uppercase transition-all ${view === 'constructors' ? 'bg-f1-red text-white shadow-lg shadow-f1-red/20' : 'text-text-secondary hover:text-white'}`}
            >
              Constructors
            </button>
          </div>
        </div>
      </div>

      <div className="f1-card overflow-hidden">
        {view === 'drivers' && (
          <div className="w-full">
            <div className="grid grid-cols-[80px_1fr_1fr_100px] p-4 border-b border-white/5 bg-white/5 font-mono text-xs text-text-secondary uppercase tracking-wider">
              <div className="text-center">Pos</div>
              <div>Driver</div>
              <div>Constructor</div>
              <div className="text-right">Points</div>
            </div>
            {standings.drivers.length === 0 && (
              <div className="p-8 text-center text-text-secondary font-mono">No data available. API may be rate limited or season hasn't started.</div>
            )}
            {standings.drivers.map((d) => (
              <div key={d.Driver.driverId} className="grid grid-cols-[80px_1fr_1fr_100px] p-4 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors relative group">
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1" 
                  style={{ backgroundColor: teamColors[d.Constructors[0]?.constructorId.replace(/_/g, '')] || '#fff' }} 
                />
                <div className="text-center font-heading font-bold text-2xl text-white/50 group-hover:text-white transition-colors">{d.position}</div>
                <div className="font-heading font-bold text-xl uppercase tracking-wide">
                  <span className="text-white/60 mr-2">{d.Driver.givenName}</span>
                  <span className="text-white">{d.Driver.familyName}</span>
                </div>
                <div className="text-sm font-mono text-text-secondary uppercase tracking-wider">{d.Constructors[0]?.name}</div>
                <div className="text-right font-mono font-bold text-xl text-f1-red">{d.points}</div>
              </div>
            ))}
          </div>
        )}
        
        {view === 'constructors' && (
          <div className="w-full">
            <div className="grid grid-cols-[80px_1fr_100px_100px] p-4 border-b border-white/5 bg-white/5 font-mono text-xs text-text-secondary uppercase tracking-wider">
              <div className="text-center">Pos</div>
              <div>Constructor</div>
              <div className="text-right">Wins</div>
              <div className="text-right">Points</div>
            </div>
            {standings.constructors.length === 0 && (
              <div className="p-8 text-center text-text-secondary font-mono">No data available.</div>
            )}
            {standings.constructors.map((c) => (
              <div key={c.Constructor.constructorId} className="grid grid-cols-[80px_1fr_100px_100px] p-4 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors relative group">
                <div 
                  className="absolute left-0 top-0 bottom-0 w-[6px]" 
                  style={{ backgroundColor: teamColors[c.Constructor.constructorId.replace(/_/g, '')] || '#fff' }} 
                />
                <div className="text-center font-heading font-bold text-2xl text-white/50 group-hover:text-white transition-colors">{c.position}</div>
                <div className="font-heading font-bold text-2xl uppercase tracking-widest">{c.Constructor.name}</div>
                <div className="text-right text-sm font-mono text-text-secondary uppercase">{c.wins}</div>
                <div className="text-right font-mono font-bold text-2xl text-f1-red">{c.points}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
