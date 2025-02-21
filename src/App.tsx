import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Features } from './components/Features';
import { PartnerChurches } from './components/PartnerChurches';
import { ChatDemo } from './components/ChatDemo';
import { OtherProjects } from './components/OtherProjects';
import { CTA } from './components/CTA';
import { TypebotChat } from './components/TypebotChat';
import { WaveBackground } from './components/WaveBackground';
import { ToastContainer } from './components/ui/ToastContainer';
import { ProfileCompletion } from './pages/ProfileCompletion';
import { ProfileUpdate } from './pages/ProfileUpdate';
import { Dashboard } from './pages/Dashboard';
import { MemberForm } from './pages/MemberForm';
import { MemberList } from './pages/MemberList';
import { DetalhesDeMembros } from './pages/DetalhesDeMembros';
import { Settings } from './pages/Settings';
import { ListaDeVisitantes } from './pages/ListaDeVisitantes';
import { ConsoleAdmin } from './pages/ConsoleAdmin';
import { ConsoleAdminLogin } from './pages/ConsoleAdminLogin';
import { ChildrenManagement } from './pages/ChildrenManagement';
import { PequenosGrupos } from './pages/PequenosGrupos';
import { Departments } from './pages/Departments';
import { CalendarPage } from './pages/Calendar';
import { useAuthContext } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  
  if (loading) return null;
  
  return user ? <>{children}</> : <Navigate to="/" />;
}

function LandingPage() {
  return (
    <>
      <Header />
      <Features />
      <PartnerChurches />
      <ChatDemo />
      <OtherProjects />
      <CTA />
      <TypebotChat />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#D3D3D3] relative overflow-hidden">
        <WaveBackground />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/consoleadmin/login" element={<ConsoleAdminLogin />} />
            <Route 
              path="/consoleadmin" 
              element={
                <PrivateRoute>
                  <ConsoleAdmin />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile/complete" 
              element={
                <PrivateRoute>
                  <ProfileCompletion />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile/update" 
              element={
                <PrivateRoute>
                  <ProfileUpdate />
                </PrivateRoute>
              } 
            />
            <Route
              path="/members"
              element={
                <PrivateRoute>
                  <MemberList />
                </PrivateRoute>
              }
            />
            <Route
              path="/members/new"
              element={
                <PrivateRoute>
                  <MemberForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/members/:id/edit"
              element={
                <PrivateRoute>
                  <MemberForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/detalhes-membros"
              element={
                <PrivateRoute>
                  <DetalhesDeMembros />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/visitantes"
              element={
                <PrivateRoute>
                  <ListaDeVisitantes />
                </PrivateRoute>
              }
            />
            <Route
              path="/children-management"
              element={
                <PrivateRoute>
                  <ChildrenManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/pequenosgrupos"
              element={
                <PrivateRoute>
                  <PequenosGrupos />
                </PrivateRoute>
              }
            />
            <Route
              path="/departments"
              element={
                <PrivateRoute>
                  <Departments />
                </PrivateRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <PrivateRoute>
                  <CalendarPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}