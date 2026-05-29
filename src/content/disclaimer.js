export const disclaimerContent = {
  sections: [
    {
      id: "nature-of-data",
      title: "NATURE OF DATA DISPLAYED",
      content: [
        "APEX acts purely as a visualization layer. <white>We do not generate, verify, or host the race data.</white>",
        "The telemetry, standings, intervals, and historical results you see on this dashboard are dynamically fetched from community-maintained databases and public endpoints."
      ]
    },
    {
      id: "data-sources",
      title: "DATA SOURCES & ATTRIBUTION",
      content: [
        "The dashboard aggregates information from two primary community sources:",
        "<white>Historical Data</white>: Provided by the <teal>Ergast Developer API</teal>, an experimental web service which provides a historical record of motor racing data for non-commercial purposes.",
        "<white>Live Telemetry</white>: Sourced from the <teal>OpenF1 API</teal>, which provides real-time access to Formula 1 data during live sessions."
      ]
    },
    {
      id: "real-time-limitations",
      title: "REAL-TIME DATA LIMITATIONS",
      content: [
        "While APEX strives to provide a \"live\" broadcast experience, true real-time synchronization is impossible via public community APIs.",
        "Network latency, API polling limits, and upstream processing can introduce noticeable delays.",
        "<orangeBox>Live telemetry data may be delayed by 5–30 seconds from actual race events. Do not use for betting, official timing, or competitive purposes.</orangeBox>"
      ]
    },
    {
      id: "no-affiliation",
      title: "NO AFFILIATION WITH F1 / FIA / TEAMS",
      content: [
        "To reiterate our Terms of Service: APEX is a passion project built by and for fans.",
        "It is <red>not endorsed by, affiliated with, or sponsored by</red> Formula One World Championship Limited, the FIA, or any specific racing team.",
        "Logos, names, and images used in the UI are for descriptive and identification purposes only under fair use principles."
      ]
    },
    {
      id: "accuracy-completeness",
      title: "ACCURACY & COMPLETENESS",
      content: [
        "The community APIs powering APEX occasionally drop packets, miss sector times, or miscalculate gaps due to the complexity of live timing.",
        "We apply smoothing algorithms to telemetry graphs to make them readable, which means <white>visualized data is an approximation</white>, not a mathematically flawless record.",
        "If you spot a discrepancy between APEX and the official F1 TV timing tower, the official broadcast is always the correct source."
      ]
    },
    {
      id: "fan-use",
      title: "FAN USE ONLY DECLARATION",
      content: [
        "By accessing this data, you acknowledge that APEX is an educational tool designed to help fans understand race pace, tire degradation, and head-to-head metrics.",
        "It is not a substitute for professional timing software or official FIA documentation."
      ]
    },
    {
      id: "reporting-issues",
      title: "REPORTING DATA ISSUES",
      content: [
        "If you encounter persistent data errors, frozen telemetry, or broken UI elements, it is often due to an upstream API change or a temporary rate limit.",
        "Before reporting an issue, please check the status pages of our data providers. If the issue appears to be related to the APEX UI itself, you can report it on our public repository."
      ]
    }
  ]
};
