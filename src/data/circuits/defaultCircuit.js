export const defaultCircuit = {
  stats: {
    raceDistance: "305.000 KM",
    circuitLength: "5.000 KM",
    laps: "61",
    lapRecord: {
      time: "1:20.000",
      driver: "Unknown",
      year: "2020"
    }
  },
  elevation: [
    { name: "1", elevation: 10 },
    { name: "5", elevation: 15 },
    { name: "10", elevation: 5 },
    { name: "15", elevation: 20 },
    { name: "20", elevation: 10 }
  ],
  elevationChange: 15,
  seriesSpeed: {
    f1: { speed: "230.0", time: "1:20.000" },
    f2: { speed: "200.0", time: "1:32.000" },
    f3: { speed: "180.0", time: "1:40.000" }
  },
  characterStats: {
    gForce: { value: "4.5G", sub: "AT FASTEST CORNER" },
    gearChanges: { value: "40", sub: "GEAR CHANGES PER LAP" },
    topSpeed: { value: "320 KPH", sub: "HIGHEST RECORDED" },
    overtakes: { value: "35", sub: "(LAST SEASON)" },
    trackWidth: { value: "12m", sub: "AVERAGE WIDTH" }
  },
  analystNote: "This circuit offers a balanced mix of high-speed straights and technical low-speed corners. Teams must find a compromise setup between straight-line speed and downforce for the twisty sections.",
  difficultyRatings: {
    physical: 3,
    technical: 3,
    overtaking: 3
  },
  tyreSelection: ['C2', 'C3', 'C4'],
  strategyStats: {
    safetyCarProb: 40,
    safetyCarAvgLaps: 3,
    pitLaneLength: "350M",
    fastestPit: { time: "2.100s", team: "Red Bull", year: "2023" },
    poleWins: { wins: 10, total: 20 }, // 50%
    wetRaceProb: 15,
    fuelEffect: "0.30 SEC/10KG",
    fuelConsumption: "1.70 KG/LAP",
    fullThrottle: 65,
    downforce: 5,
    brakeWear: 5,
    tyreWear: 5,
    avgPitStops: 1.5,
    undercutWindow: "2 LAPS",
    tyreDelta: "+0.8s/LAP",
    pitLaneTimeLoss: "~20s"
  },
  speedAnnotations: [
    { turn: "T1", speed: "120", gear: "3" },
    { turn: "T5", speed: "280", gear: "7" }
  ]
};
