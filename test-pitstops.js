// fetch is built in

const ERGAST_BASE = 'https://api.jolpi.ca/ergast/f1';
const OPENF1_BASE = 'https://api.openf1.org/v1';

async function testPitstops() {
  const year = 2026;
  const round = 1;
  console.log(`Fetching 2026 Round 1 pitstops...`);

  const sessionsRes = await fetch(`${OPENF1_BASE}/sessions?year=${year}&session_type=Race`);
  const sessionsData = await sessionsRes.json();
  const sortedSessions = sessionsData.filter(s => s.session_name === 'Race').sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
  
  for (let round = 1; round <= 3; round++) {
    console.log(`\nFetching 2026 Round ${round} pitstops...`);

    const pitRes = await fetch(`${ERGAST_BASE}/${year}/${round}/pitstops.json`);
    const pitData = await pitRes.json();
    console.log('Ergast Pitstops:', pitData?.MRData?.RaceTable?.Races?.[0]?.PitStops?.length || 0);

    const session = sortedSessions[round - 1];
    if (session) {
      const of1PitRes = await fetch(`${OPENF1_BASE}/pit?session_key=${session.session_key}`);
      const of1Pits = await of1PitRes.json();
      console.log(`OpenF1 Pitstops for session ${session.session_key} (${session.circuit_short_name}):`, of1Pits.length);
    } else {
      console.log(`No OpenF1 session found for 2026 round ${round}`);
    }
  }
}

testPitstops().catch(console.error);
