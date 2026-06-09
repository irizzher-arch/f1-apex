import React from 'react';
import { motion } from 'framer-motion';
import { ChapterWrapper } from '../ChapterWrapper';
import { ConceptCard } from '../shared/ConceptCard';
import { ChapterFooter } from '../shared/ChapterFooter';

export const Ch02RaceWeekend = () => {
  const sessions = [
    {
      day: 'THURSDAY / FRIDAY',
      color: '#00D2BE',
      items: [
        {
          name: 'FREE PRACTICE 1',
          duration: '1 hour',
          purpose: 'Teams learn the circuit, test new parts, gather data',
          icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        },
        {
          name: 'FREE PRACTICE 2',
          duration: '1 hour',
          purpose: 'Long run pace simulation, tyre life testing'
        }
      ]
    },
    {
      day: 'SATURDAY',
      color: '#FF8700',
      items: [
        {
          name: 'FREE PRACTICE 3',
          duration: '1 hour',
          purpose: 'Final setup adjustments before qualifying'
        },
        {
          name: 'QUALIFYING',
          duration: '~1 hour',
          purpose: 'Sets the starting grid for Sunday',
          badge: 'SETS THE GRID',
          badgeColor: '#E8002D',
          premium: true
        }
      ]
    },
    {
      day: 'SUNDAY',
      color: '#E8002D',
      items: [
        {
          name: 'THE RACE',
          duration: '~2 hours',
          purpose: 'The main event. Points awarded. Champions made.',
          badge: 'RACE DAY',
          badgeColor: '#E8002D',
          premium: true,
          subItems: ['FORMATION LAP', 'COOLDOWN LAP']
        }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <ChapterWrapper
      id="ch02"
      num="02"
      title="THE RACE WEEKEND"
      hook="A Grand Prix weekend is three days of action — not just Sunday's race."
    >
      {/* BLOCK A — WEEKEND TIMELINE INFOGRAPHIC */}
      <div className="relative mt-4">
        {/* Vertical Dashed Line (Desktop) */}
        <div className="hidden md:block absolute left-[12px] top-6 bottom-6 w-[2px] border-l-2 border-dashed border-white/10 z-0" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-10 md:gap-8 relative z-10"
        >
          {sessions.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col md:flex-row gap-4 md:gap-12 relative">
              
              {/* Day Label (Desktop: Left side, Mobile: Top) */}
              <motion.div variants={itemVariants} className="md:w-32 shrink-0 md:text-right pt-2">
                <span className="font-mono text-[12px] font-bold tracking-widest uppercase" style={{ color: group.color }}>
                  {group.day}
                </span>
              </motion.div>

              {/* Session Cards */}
              <div className="flex-1 flex flex-col gap-4">
                {group.items.map((session, sessionIdx) => (
                  <motion.div 
                    key={sessionIdx}
                    variants={itemVariants}
                    className={`bg-white/[0.03] border-y border-r border-white/[0.07] rounded-lg p-5 relative overflow-hidden transition-colors hover:bg-white/[0.05] ${
                      session.premium ? 'shadow-[0_4px_24px_rgba(0,0,0,0.4)]' : ''
                    }`}
                    style={{ borderLeft: `4px solid ${group.color}` }}
                  >
                    {session.premium && (
                      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundColor: group.color }} />
                    )}
                    
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <div className="flex items-center gap-2">
                        {session.icon && <span className="text-white/70">{session.icon}</span>}
                        <h4 className="font-heading text-lg text-white font-bold tracking-wider uppercase m-0">
                          {session.name}
                        </h4>
                      </div>
                      {session.badge && (
                        <div 
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-md"
                          style={{ backgroundColor: session.badgeColor }}
                        >
                          {session.badge}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1 relative z-10">
                      <div className="font-mono text-xs text-white/40">DURATION: {session.duration}</div>
                      <div className="font-inter text-sm text-white/70 mt-1">{session.purpose}</div>
                    </div>

                    {session.subItems && (
                      <div className="flex gap-2 mt-4 pt-3 border-t border-white/5 relative z-10">
                        {session.subItems.map((sub, i) => (
                          <div key={i} className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded text-white/50">
                            + {sub}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* BLOCK B — PARC FERMÉ EXPLAINED */}
      <div className="mt-6">
        <ConceptCard 
          title="PARC FERMÉ RULE"
          borderColor="#FF8700"
          bgTint
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF8700]"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          }
          content="After qualifying begins, cars enter 'Parc Fermé' conditions. Teams cannot make significant mechanical changes to the car. This means the exact setup you qualify with must be used for Sunday's race. It prevents wealthy teams from using special 'qualifying engines' and forces teams to find a compromise setup that is fast for one lap but still gentle on tyres for the race."
        />
      </div>

      {/* FOOTER */}
      <ChapterFooter 
        keyTakeaway="Friday is for testing, Saturday is for pure speed, and Sunday is where the points are scored."
        nextChapterId="ch03"
        nextChapterTitle="QUALIFYING EXPLAINED"
      />
    </ChapterWrapper>
  );
};
