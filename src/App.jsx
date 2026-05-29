import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';

import { TrackFactfilePage } from '@/pages/TrackFactfilePage';

import { BeginnerGuidePage } from '@/pages/BeginnerGuidePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/circuit/:circuitId" element={<TrackFactfilePage />} />
        <Route path="/learn" element={<BeginnerGuidePage />} />
      </Routes>
    </Router>
  );
}

export default App;
