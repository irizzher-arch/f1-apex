import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';

import { TrackFactfilePage } from '@/pages/TrackFactfilePage';
import { BeginnerGuidePage } from '@/pages/BeginnerGuidePage';
import { DriversPage } from '@/pages/DriversPage';
import { TeamsPage } from '@/pages/TeamsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/circuit/:circuitId" element={<TrackFactfilePage />} />
        <Route path="/learn" element={<BeginnerGuidePage />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
