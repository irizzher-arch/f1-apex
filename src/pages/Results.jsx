import React, { useEffect, useState } from 'react';
import { useErgast } from '@/hooks/useErgast';
import { useStore } from '@/store/useStore';
import { teamColors } from '@/utils/teamColors';

export const Results = () => {
  const { session } = useStore();
  const { fetchResults, fetchSchedule, loading } = useErgast();
  const [results, setResults] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [selectedRound, setSelectedRound] = useState('last');

  useEffect(() => {
    fetchSchedule(session.year).then((data) => {
      setSchedule(data);
      // Find last completed round
      const completed = data.filter(r => new Date(r.date) < new Date());
      if (completed.length > 0) {
        setSelectedRound(completed[completed.length - 1].round);
      }
    });
  }, [session.year, fetchSchedule]);

  useEffect(() => {
    if (selectedRound && selectedRound !== 'last') {
      fetchResults(session.year, selectedRound).then(setResults);
    } else if (selectedRound === 'last') {
      fetchResults(session.year, 'last').then(setResults);
    }
  }, [session.year, selectedRound, fetchResults]);

  if (loading && !results) {
    return <div className="text-f1-red text-center py-20 font-mono animate-pulse">Loading Results Data...</div>;
  }

  return (
    <div className="relative w-full min-h-[800px]">
      {/* Background GIF */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl opacity-40 mix-blend-screen pointer-events-none">
        <img 
          src="https://mir-s3-cdn-cf.behance.net/project_modules/source/f22a5a245443887.69ae60f0cdd0a.gif" 
          className="w-full h-full object-cover" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-base via-transparent to-background-base" />
        <div className="absolute inset-0 bg-gradient-to-r from-background-base via-transparent to-background-base" />
      </div>

      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto relative z-10 p-6">
      <div className="relative w-full h-[200px] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <img 
          src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/88a4f7245443887.69ae60efe0c1c.png" 
          className="w-full h-full object-cover opacity-70" 
          alt="Results Header"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-base via-transparent to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <h1 className="text-4xl font-heading font-bold uppercase tracking-widest !m-0 drop-shadow-lg">
            Race Results
          </h1>
          <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10 overflow-x-auto max-w-full backdrop-blur-md">
            {schedule.filter(r => new Date(r.date) < new Date()).map(race => (
              <button
                key={race.round}
                onClick={() => setSelectedRound(race.round)}
                className={`px-4 py-2 rounded font-heading font-bold uppercase whitespace-nowrap transition-all ${selectedRound === race.round ? 'bg-f1-red text-white shadow-lg shadow-f1-red/20' : 'text-text-secondary hover:text-white'}`}
              >
                R{race.round}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!results ? (
         <div className="p-8 text-center text-text-secondary font-mono bg-white/5 rounded-xl border border-white/10">
            No race results available for this round yet.
          </div>
      ) : (
        <div className="f1-card overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-white/5 relative group">
            <div className="corner-accent corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-2xl font-heading font-bold uppercase !m-0">{results.raceName}</h2>
            <p className="text-text-secondary font-mono text-sm mt-1">{results.Circuit.circuitName}</p>
          </div>
          <div className="w-full">
            <div className="grid grid-cols-[60px_1fr_1fr_100px_80px] p-4 border-b border-white/5 bg-white/5 font-mono text-xs text-text-secondary uppercase tracking-wider">
              <div className="text-center">Pos</div>
              <div>Driver</div>
              <div>Constructor</div>
              <div className="text-right">Time/Ret</div>
              <div className="text-right">Pts</div>
            </div>
            
            {results.Results.map((res) => (
              <div key={res.number} className="grid grid-cols-[60px_1fr_1fr_100px_80px] p-4 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors relative group">
                <div 
                  className="absolute left-0 top-0 bottom-0 w-[6px]" 
                  style={{ backgroundColor: teamColors[res.Constructor.constructorId.replace(/_/g, '')] || '#fff' }} 
                />
                <div className="text-center font-heading font-bold text-xl text-white/50 group-hover:text-white transition-colors">{res.position}</div>
                <div className="font-heading font-bold text-xl uppercase tracking-wide">
                  <span className="text-white/60 mr-2">{res.Driver.givenName}</span>
                  <span className="text-white">{res.Driver.familyName}</span>
                </div>
                <div className="text-sm font-mono text-text-secondary uppercase tracking-wider">{res.Constructor.name}</div>
                <div className="text-right font-mono text-sm text-white/80">{res.Time ? res.Time.time : res.status}</div>
                <div className="text-right font-mono font-bold text-xl text-f1-red">{res.points}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
