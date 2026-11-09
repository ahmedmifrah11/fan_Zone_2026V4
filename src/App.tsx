/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PortalPage } from './pages/PortalPage';
import { HostPage } from './pages/HostPage';
import { StudioPage } from './pages/StudioPage';
import { ContentPage } from './pages/ContentPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalPage />} />
        <Route path="/host" element={<HostPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

