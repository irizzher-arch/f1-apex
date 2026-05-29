export const privacyContent = {
  sections: [
    {
      id: "overview",
      title: "OVERVIEW & SCOPE",
      content: [
        "This Privacy Policy outlines how the APEX F1 fan dashboard handles data when you visit and interact with the application.",
        "APEX is a <teal>client-side</teal> application. This means most of the processing happens directly in your browser. We <red>do not</red> maintain backend databases containing user profiles or authentication records."
      ]
    },
    {
      id: "data-collected",
      title: "DATA WE COLLECT",
      content: [
        "As an open-access fan tool, APEX minimizes data collection by design.",
        "<white>Browser & Device Info</white>: Standard HTTP request data required to serve the web application.",
        "<white>Session Data</white>: Local state stored temporarily in your browser to remember your active tab and preferences during a visit.",
        "<white>Analytics</white>: We may use anonymous analytics to understand site traffic and usage patterns. <red>No personally identifiable information</red> is tracked."
      ],
      listItems: [
        "We do not require user accounts or logins.",
        "We do not collect names, email addresses, or payment information.",
        "We do not track your activity across other websites."
      ]
    },
    {
      id: "data-usage",
      title: "HOW WE USE YOUR DATA",
      content: [
        "The minimal data collected is used strictly for operational purposes:",
        "To deliver the application interface to your device.",
        "To ensure the dashboard functions correctly across different screen sizes and browsers.",
        "To maintain caching and improve the performance of live telemetry queries."
      ]
    },
    {
      id: "third-party",
      title: "THIRD-PARTY APIS & SERVICES",
      content: [
        "APEX relies on public and community-driven APIs to function. When you use APEX, your browser makes direct requests to these services:",
        "<white>Ergast Developer API</white> <teal>[ERGAST]</teal>: Provides historical race results, driver standings, and circuit data.",
        "<white>OpenF1 API</white> <teal>[OPENF1]</teal>: Provides live and near-live telemetry, intervals, and car positioning data.",
        "These services are governed by their own respective privacy policies. APEX acts only as a visualization layer for their public endpoints."
      ]
    },
    {
      id: "cookies",
      title: "COOKIES & LOCAL STORAGE",
      content: [
        "APEX uses <white>Local Storage</white> within your browser rather than traditional cookies. This is used exclusively to save your UI preferences (such as the currently active view) so you don't lose your place when reloading the page.",
        "You can clear this data at any time using your browser's developer tools or history settings."
      ]
    },
    {
      id: "rights",
      title: "YOUR RIGHTS",
      content: [
        "Because APEX does not collect or store personal user accounts, there is no personal profile data to export or delete.",
        "If you have concerns about the anonymous telemetry or analytics data, you may use standard browser extensions to block analytics scripts without affecting core dashboard functionality."
      ]
    },
    {
      id: "changes",
      title: "CHANGES TO THIS POLICY",
      content: [
        "We may update this Privacy Policy periodically to reflect changes in our data practices or integrations with new third-party APIs.",
        "The <white>Last Updated</white> date at the top of this page indicates when the most recent modifications were published."
      ]
    },
    {
      id: "contact",
      title: "CONTACT",
      content: [
        "If you have questions about this policy or the technical architecture of APEX, please reach out via the project's public repository or issue tracker."
      ]
    }
  ]
};
