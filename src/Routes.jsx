import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import HomeDashboard from './pages/home-dashboard';
import VideoWatchPage from './pages/video-watch-page';
import LiveStreamWatch from './pages/live-stream-watch';
import WalletConnection from './pages/wallet-connection';
import CreatorDashboard from './pages/creator-dashboard';
import TokenShop from './pages/token-shop';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/home-dashboard" element={<HomeDashboard />} />
        <Route path="/video-watch-page" element={<VideoWatchPage />} />
        <Route path="/live-stream-watch" element={<LiveStreamWatch />} />
        <Route path="/wallet-connection" element={<WalletConnection />} />
        <Route path="/creator-dashboard" element={<CreatorDashboard />} />
        <Route path="/token-shop" element={<TokenShop />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
