import React, { useState, useCallback } from 'react';
import useSimulation from './hooks/useSimulation.js';
import SimulationTab from './components/SimulationTab.jsx';
import DiseaseProfilesTab from './components/DiseaseProfilesTab.jsx';
import CinematicEarth from './components/CinematicEarth.jsx';
import FlatWorldMap from './components/FlatWorldMap.jsx';
import HomePage from './pages/HomePage.jsx';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [earthHovered, setEarthHovered] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const simulation = useSimulation();

  const handleLaunch = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      document.body.style.cursor = 'auto';
      setActiveTab('Simulation');
      setIsTransitioning(false); // End transition so camera can settle
    }, 1400);
  };

  const loadDiseaseProfile = useCallback((disease) => {
    simulation.setParams({
      r0: disease.r0,
      incubationPeriod: disease.incubationPeriod,
      infectiousPeriod: disease.infectiousPeriod,
      caseFatalityRate: disease.caseFatalityRate,
      mutationRate: disease.mutationRate
    });
    setActiveTab('Simulation');
  }, [simulation.setParams]);

  const isSimulationMode = activeTab !== 'Home';
  const hasStarted = simulation.isRunning || simulation.day > 0 || simulation.isStaging;

  return (
    <div className="app-root">
      {/* Background container */}
      <div 
         className="canvas-container" 
         onMouseEnter={() => !isSimulationMode && setEarthHovered(true)} 
         onMouseLeave={() => !isSimulationMode && setEarthHovered(false)}
      >
        {isSimulationMode && hasStarted ? (
          <FlatWorldMap 
            countryStates={simulation.countryStates}
              params={simulation.params}
              isRunning={simulation.isRunning}
              inboundInfectionsRef={simulation.inboundInfectionsRef}
              transitEvents={simulation.transitEvents}
              inboundVaccinesRef={simulation.inboundVaccinesRef}
              seedCountry={simulation.seedCountry}
              vaccineProgress={simulation.vaccineProgress}
              gameMode={simulation.gameMode}
          />
        ) : (
          <CinematicEarth 
             isTransitioning={isTransitioning} 
             layoutMode={isSimulationMode ? 'hud' : 'center'}
             onEnter={!isSimulationMode ? handleLaunch : () => {}} 
             seedCountry={simulation.seedCountry}
             setSeedCountry={simulation.setSeedCountry}
             onHoveredCountryChange={setHoveredCountry}
             gameMode={simulation.gameMode}
          />
        )}
      </div>

      {/* Home Overlay */}
      {!isSimulationMode && (
         <HomePage isEntering={isTransitioning} hovered={earthHovered} />
      )}

      {/* HUD Layout */}
      {isSimulationMode && (
        <div className="hud-layout fade-in">
          
          <nav className="hud-sidebar">
            <div className="brand-icon-hud" onClick={() => { setIsTransitioning(false); setActiveTab('Home'); }}>
               <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                 <path d="M8 1L14.9282 5V11L8 15L1.07179 11V5L8 1Z" fill="#00f5d4" fillOpacity="0.95"/>
               </svg>
            </div>
            
            <div className="hud-nav-links">
              <button 
                className={`hud-nav-btn ${activeTab === 'Simulation' ? 'active' : ''}`}
                onClick={() => setActiveTab('Simulation')}
                title="Simulation"
              >
                 <svg width="20" height="20" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="0" y="0" width="6" height="6" rx="1.5" />
                  <rect x="8" y="0" width="6" height="6" rx="1.5" />
                  <rect x="0" y="8" width="6" height="6" rx="1.5" />
                  <rect x="8" y="8" width="6" height="6" rx="1.5" />
                </svg>
              </button>
              <button 
                className={`hud-nav-btn ${activeTab === 'Disease Profiles' ? 'active' : ''}`}
                onClick={() => setActiveTab('Disease Profiles')}
                title="Profiles"
              >
                <svg width="20" height="20" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="0" y="1" width="14" height="2.5" rx="1" />
                  <rect x="0" y="5.75" width="14" height="2.5" rx="1" />
                  <rect x="0" y="10.5" width="10" height="2.5" rx="1" />
                </svg>
              </button>
            </div>
          </nav>

          <main className="hud-main">
            {activeTab === 'Simulation' ? (
              <SimulationTab {...simulation} hoveredCountry={hoveredCountry} />
            ) : (
              <DiseaseProfilesTab onSimulate={loadDiseaseProfile} />
            )}
          </main>

        </div>
      )}
    </div>
  );
}
