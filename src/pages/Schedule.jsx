import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useErgast } from '@/hooks/useErgast';
import { useStore } from '@/store/useStore';
import { TrackSVG } from '@/components/ui/TrackSVG';
import { Link } from 'react-router-dom';

export const Schedule = () => {
  const { session } = useStore();
  const { fetchSchedule, loading } = useErgast();
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetchSchedule(session.year).then(setSchedule);
  }, [session.year, fetchSchedule]);

  if (loading) {
    return <div className="text-f1-red text-center py-20 font-mono animate-pulse">Loading Schedule Data...</div>;
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-4xl font-heading font-black uppercase tracking-widest text-white !m-0">
            {session.year} Season Schedule
          </h1>
          <p className="text-text-secondary font-mono mt-2">Full calendar and circuit details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {schedule.length === 0 && (
          <div className="col-span-full p-8 text-center text-text-secondary font-mono bg-white/5 rounded-xl border border-white/10">
            No schedule data available for {session.year}.
          </div>
        )}
        {schedule.map((race, i) => (
          <Link key={race.round} to={`/circuit/${race.Circuit.circuitId}`} className="block">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="f1-card p-6 flex flex-col gap-4 relative group hover:-translate-y-2 transition-all duration-300 overflow-hidden min-h-[250px] border border-white/10 hover:border-f1-red/50 hover:shadow-[0_0_30px_rgba(232,0,45,0.15)]"
            >
              {/* Background SVG Track Map */}
              <div className="absolute -right-10 -bottom-10 w-[200px] h-[200px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none rotate-12">
                <TrackSVG circuitId={race.Circuit.circuitId} />
              </div>

              <div className="corner-accent corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 right-0 p-4 font-mono text-7xl font-black text-white/5 group-hover:text-f1-red/10 transition-colors pointer-events-none">
                {race.round.padStart(2, '0')}
              </div>
              
              <div className="flex flex-col relative z-10">
                <span className="text-f1-red font-bold font-mono tracking-widest text-sm mb-1 uppercase">
                  {new Date(race.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                <h3 className="font-heading font-black text-2xl uppercase m-0 leading-tight text-white group-hover:text-f1-red transition-colors w-[85%]">{race.raceName}</h3>
                <span className="text-text-secondary font-mono text-sm mt-2 block">{race.Circuit.circuitName}</span>
              </div>

              <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-end relative z-10">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">Location</span>
                  <span className="font-mono text-xs text-white uppercase">{race.Circuit.Location.locality}, {race.Circuit.Location.country}</span>
                </div>
                {new Date(race.date) < new Date() ? (
                  <span className="px-3 py-1 rounded bg-white/5 text-white/50 text-[10px] font-mono uppercase tracking-wider border border-white/10">Completed</span>
                ) : (
                  <span className="px-3 py-1 rounded bg-f1-red/20 text-f1-red border border-f1-red/30 text-[10px] font-mono uppercase tracking-wider font-bold shadow-[0_0_10px_rgba(232,0,45,0.2)]">Upcoming</span>
                )}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};
