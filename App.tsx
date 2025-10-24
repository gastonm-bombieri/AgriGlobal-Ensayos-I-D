
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import EnsayoDetail from './components/EnsayoDetail';
import { Ensayo } from './types';
import { useEnsayos } from './hooks/useEnsayos';
import EnsayoForm from './components/EnsayoForm';
import { AgriGlobalIcon, LogoutIcon } from './components/Icons';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'detail'>('dashboard');
  const [selectedEnsayo, setSelectedEnsayo] = useState<Ensayo | null>(null);
  const [isEnsayoFormOpen, setIsEnsayoFormOpen] = useState(false);
  const [ensayoToEdit, setEnsayoToEdit] = useState<Ensayo | null>(null);
  
  const { user, logout } = useAuth();
  const { getEnsayoById } = useEnsayos();

  const handleSelectEnsayo = (ensayo: Ensayo) => {
    setSelectedEnsayo(ensayo);
    setCurrentView('detail');
  };

  const handleBackToDashboard = () => {
    setSelectedEnsayo(null);
    setCurrentView('dashboard');
  };

  const handleOpenNewEnsayoForm = () => {
    setEnsayoToEdit(null);
    setIsEnsayoFormOpen(true);
  };

  const handleOpenEditEnsayoForm = (ensayoId: string) => {
    const ensayo = getEnsayoById(ensayoId);
    if (ensayo) {
      setEnsayoToEdit(ensayo);
      setIsEnsayoFormOpen(true);
    }
  };

  const handleCloseEnsayoForm = () => {
    setIsEnsayoFormOpen(false);
    setEnsayoToEdit(null);
  };
  
  const Header: React.FC = () => (
    <header className="bg-[#153f38] shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <AgriGlobalIcon className="h-8 w-8 text-white" />
          <h1 className="text-2xl font-bold text-white ml-2">AgriGlobal I+D</h1>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium hidden sm:block">
              Hola, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#153f38] focus:ring-white"
            >
              <LogoutIcon className="w-5 h-5 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {currentView === 'dashboard' && (
            <Dashboard onSelectEnsayo={handleSelectEnsayo} onNewEnsayo={handleOpenNewEnsayoForm} />
          )}
          {currentView === 'detail' && selectedEnsayo && (
            <EnsayoDetail
              ensayo={selectedEnsayo}
              onBack={handleBackToDashboard}
              onEditEnsayo={handleOpenEditEnsayoForm}
            />
          )}
        </div>
      </main>
      {isEnsayoFormOpen && <EnsayoForm ensayoToEdit={ensayoToEdit} onClose={handleCloseEnsayoForm} />}
    </div>
  );
};

export default App;
