import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Login from './components/Login';
import VotingPage from './components/VotingPage';
import AdminDashboard from './components/AdminDashboard';
import ThankYouPage from './components/ThankYouPage';
import ProtectedRoute from './components/ProtectedRoute';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

function App() {
  return (
    <MantineProvider>
      <Notifications />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/voting"
            element={
              <ProtectedRoute>
                <VotingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;