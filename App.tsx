
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { games as initialGames } from './data';
import { Game } from './types';
import Header from './components/Header';
import GameTile from './components/GameTile';
import OwnerDashboard from './components/OwnerDashboard';
import IntroScreen from './components/IntroScreen';
import { ShieldAlert, X } from 'lucide-react';

const STORAGE_KEY = 'nova_ps5_library_data';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [localGames, setLocalGames] = useState<Game[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load games from localStorage or use defaults
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

  // Enable horizontal scrolling with the mouse wheel
  useEffect(() => {
    if (showIntro) return;
    const el = scrollContainerRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 2.5,
          behavior: 'auto'
        });
      };
      el.addEventListener('wheel', onWheel, { passive: false });
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, [localGames, showIntro]);

  const saveGames = (newGames: Game[]) => {
    setLocalGames(newGames);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGames));
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
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
    <div className="relative min-h-screen w-full flex flex-col bg-black overflow-hidden font-['Rajdhani']">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroScreen key="intro" onComplete={() => setShowIntro(false)} />
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative flex flex-col h-screen max-h-screen w-full"
          >
            {/* Global Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBackground}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[3s]"
                    style={{ backgroundImage: `url(${currentBackground})` }}
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-black/90" />
              <div className="absolute inset-0 bg-radial-at-t from-transparent to-black" />
            </div>

            {/* UI Layer */}
            <div className="relative z-10 flex flex-col h-full">
              <Header 
                isOwner={isOwner} 
                onOwnerClick={() => isOwner ? setShowDashboard(true) : setShowLogin(true)} 
              />

              <main className="flex-grow flex flex-col justify-center pb-12">
                <div className="mb-8 h-48 sm:h-64 flex flex-col justify-end px-6 sm:px-12 overflow-visible">
                  <AnimatePresence mode="wait">
                    {selectedGame && (
                      <motion.div
                        key={selectedGame.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-visible"
                      >
                        <p className="text-[#0066ff] text-lg font-bold tracking-[0.4em] uppercase font-['Orbitron'] mb-3 drop-shadow-[0_0_10px_rgba(0,102,255,0.5)]">
                          Exploring
                        </p>
                        <h2 className="text-5xl sm:text-9xl font-bold text-white drop-shadow-2xl uppercase tracking-tighter leading-[0.9] sm:leading-none">
                          {selectedGame.name}
                        </h2>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative w-full overflow-visible">
                  <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory py-16 px-12 gap-20 sm:gap-24 scroll-smooth"
                  >
                    <div className="flex-shrink-0 w-2 sm:w-8" />
                    {localGames.map((game) => (
                      <div key={game.id} className="snap-center">
                        <GameTile
                          game={game}
                          isSelected={selectedGame?.id === game.id}
                          onHover={(g) => setSelectedGame(g)}
                        />
                      </div>
                    ))}
                    <div className="flex-shrink-0 w-32 sm:w-64" />
                  </div>
                </div>
              </main>

              <footer className="px-6 sm:px-12 pb-10 text-white/40 flex items-center space-x-12 uppercase tracking-[0.25em] text-[10px] sm:text-xs font-bold">
                <div className="flex items-center space-x-4 group cursor-help hover:text-white transition-all duration-300">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-white/20 group-hover:border-[#0066ff] group-hover:text-[#0066ff] transition-colors shadow-sm font-['Orbitron']">X</span>
                  <span>Launch Game</span>
                </div>
                <div className="flex items-center space-x-4 group cursor-help hover:text-white transition-all duration-300">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-white/20 group-hover:border-white transition-colors shadow-sm font-['Orbitron']">O</span>
                  <span>Return</span>
                </div>
                <div className="ml-auto flex items-center space-x-4 text-[#0066ff]">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-4 h-4 rounded-full bg-[#0066ff] animate-ping opacity-25" />
                    <div className="relative w-2.5 h-2.5 rounded-full bg-[#0066ff] shadow-[0_0_10px_#0066ff]" />
                  </div>
                  <span className="tracking-[0.3em] font-['Orbitron']">Nova Network Online</span>
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-[#111] border border-white/10 p-8 rounded-2xl shadow-2xl relative"
          >
            <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-white/20 hover:text-white"><X size={20} /></button>
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-[#0066ff]/10 rounded-full flex items-center justify-center mb-4 text-[#0066ff]">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-xl font-bold font-['Orbitron'] text-white uppercase tracking-widest">Security Access</h3>
              <p className="text-white/40 text-[10px] mt-1 tracking-widest uppercase">Enter Credentials to access Owner role</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase font-bold ml-1">Username</label>
                <input 
                  type="text" 
                  name="username"
                  required
                  placeholder="e.g. nova"
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#0066ff] outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase font-bold ml-1">Password</label>
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#0066ff] outline-none transition-colors"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#0066ff] text-white py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#0052cc] transition-all shadow-[0_0_20px_rgba(0,102,255,0.3)] mt-2"
              >
                Verify Identity
              </button>
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

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .bg-radial-at-t {
          background: radial-gradient(circle at top, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
    </div>
  );
};

export default App;
