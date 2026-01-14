
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { games as initialGames } from './data';
import { Game } from './types';
import Header from './components/Header';
import GameTile from './components/GameTile';
import OwnerDashboard from './components/OwnerDashboard';
import IntroScreen from './components/IntroScreen';
import { ShieldAlert, X, ChevronLeft, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'nova_ps5_library_data';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [localGames, setLocalGames] = useState<Game[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLocalGames(JSON.parse(saved));
      } catch (e) {
        setLocalGames(initialGames);
      }
    } else {
      setLocalGames(initialGames);
    }
  }, []);

  useEffect(() => {
    if (showIntro) return;

    const el = scrollContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollBy({
        left: e.deltaY * 1.5,
        behavior: 'auto'
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [showIntro, localGames]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = window.innerWidth * 0.4;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const saveGames = (newGames: Game[]) => {
    setLocalGames(newGames);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGames));
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const user = formData.get('username');
    const pass = formData.get('password');
    if (user === 'nova' && pass === 'stacie2378') {
      setIsOwner(true);
      setShowLogin(false);
      setShowDashboard(true);
    } else {
      alert('Unauthorized access. Invalid username or password.');
    }
  };

  const currentBackground = useMemo(() => {
    return selectedGame?.background || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop";
  }, [selectedGame]);

  return (
    <div className="ps-app">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroScreen key="intro" onComplete={() => setShowIntro(false)} />
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col h-screen max-h-screen w-full relative"
          >
            {/* Global Background Layer */}
            <div className="ps-bg-layer">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBackground}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <div className="ps-bg-image" style={{ backgroundImage: `url(${currentBackground})` }} />
                </motion.div>
              </AnimatePresence>
              <div className="ps-bg-overlay" />
              <div className="ps-radial-overlay" />
            </div>

            {/* UI Layer */}
            <div className="relative z-10 flex flex-col h-full">
              <Header 
                isOwner={isOwner} 
                onOwnerClick={() => isOwner ? setShowDashboard(true) : setShowLogin(true)} 
              />

              <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden', paddingBottom: '3rem' }}>
                <div style={{ marginBottom: '2rem', height: '16rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 3rem' }}>
                  <AnimatePresence mode="wait">
                    {selectedGame && (
                      <motion.div
                        key={selectedGame.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <p className="ps-text-blue ps-font-bold ps-uppercase" style={{ fontSize: '1.125rem', letterSpacing: '0.4em', marginBottom: '0.75rem', textShadow: '0 0 10px rgba(0,102,255,0.5)' }}>
                          Exploring
                        </p>
                        <h2 className="ps-text-white ps-font-bold ps-uppercase" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', letterSpacing: '-0.05em', lineHeight: 1, margin: 0 }}>
                          {selectedGame.name}
                        </h2>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="ps-scroller-container">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => scroll('left')}
                    style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 30, padding: '1rem', borderRadius: '9999px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
                  >
                    <ChevronLeft size={32} />
                  </motion.button>

                  <div ref={scrollContainerRef} className="ps-scroller">
                    <div style={{ flexShrink: 0, width: '2rem' }} />
                    {localGames.map((game) => (
                      <div key={game.id} className="ps-snap-center">
                        <GameTile
                          game={game}
                          isSelected={selectedGame?.id === game.id}
                          onHover={(g) => setSelectedGame(g)}
                        />
                      </div>
                    ))}
                    <div style={{ flexShrink: 0, width: '16rem' }} />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => scroll('right')}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 30, padding: '1rem', borderRadius: '9999px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
                  >
                    <ChevronRight size={32} />
                  </motion.button>
                </div>
              </main>

              <footer style={{ padding: '0 3rem 2.5rem', display: 'flex', alignItems: 'center', gap: '3rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: '0.75rem', fontWeight: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', fontFamily: 'Orbitron' }}>X</span>
                  <span>Launch</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', fontFamily: 'Orbitron' }}>O</span>
                  <span>Back</span>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--ps-blue)' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="animate-ps-ping" style={{ position: 'absolute', width: '1rem', height: '1rem', borderRadius: '50%', backgroundColor: 'var(--ps-blue)' }} />
                    <div style={{ position: 'relative', width: '0.625rem', height: '0.625rem', borderRadius: '50%', backgroundColor: 'var(--ps-blue)', boxShadow: '0 0 10px var(--ps-blue)' }} />
                  </div>
                  <span className="ps-font-orbitron">Network Online</span>
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      {showLogin && (
        <div className="ps-modal-overlay">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="ps-card">
            <button onClick={() => setShowLogin(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><X size={20} /></button>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '4rem', height: '4rem', background: 'rgba(0,102,255,0.1)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--ps-blue)' }}>
                <ShieldAlert size={32} />
              </div>
              <h3 className="ps-font-orbitron ps-uppercase" style={{ fontSize: '1.25rem', margin: 0, letterSpacing: '0.1em' }}>Access</h3>
            </div>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Username</label>
                <input type="text" name="username" required className="ps-input" placeholder="nova" />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Password</label>
                <input type="password" name="password" required className="ps-input" placeholder="••••••••" />
              </div>
              <button type="submit" className="ps-btn">Verify</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Owner Dashboard Overlay */}
      {showDashboard && isOwner && (
        <OwnerDashboard 
          games={localGames} 
          onClose={() => setShowDashboard(false)} 
          onUpdateGames={saveGames}
          onLogout={() => { setIsOwner(false); setShowDashboard(false); }}
        />
      )}
    </div>
  );
};

export default App;
