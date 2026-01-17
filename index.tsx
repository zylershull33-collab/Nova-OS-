
import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

const { 
  Settings, Search, ShieldCheck, ShieldAlert, X, ChevronLeft, ChevronRight, 
  Plus, Trash2, Mountain, Gamepad2, Sword, Ghost, Car, Rocket, 
  Shield, Zap, Music, Camera, Map, Crown, Flame 
} = LucideIcons;

// --- Data ---
const initialGames = [
  { id: 1, name: "God of War Ragnarök", icon: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=800&auto=format&fit=crop", link: "https://www.playstation.com/en-us/games/god-of-war-ragnarok/", background: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop" },
  { id: 2, name: "Horizon Forbidden West", icon: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop", link: "https://www.playstation.com/en-us/games/horizon-forbidden-west/", background: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop" },
  { id: 3, name: "Spider-Man 2", icon: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=800&auto=format&fit=crop", link: "https://www.playstation.com/en-us/games/marvels-spider-man-2/", background: "https://images.unsplash.com/photo-1509197355851-13300938a1da?q=80&w=2000&auto=format&fit=crop" },
  { id: 4, name: "Ghost of Tsushima", icon: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop", link: "https://www.playstation.com/en-us/games/ghost-of-tsushima/", background: "https://images.unsplash.com/photo-1605899435973-ca2d1a8861cf?q=80&w=2000&auto=format&fit=crop" },
  { id: 5, name: "Elden Ring", icon: "https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?q=80&w=800&auto=format&fit=crop", link: "https://en.bandainamcoent.eu/elden-ring/elden-ring", background: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=2000&auto=format&fit=crop" }
];

const SYSTEM_ICONS = [
  { name: 'Mountain', Icon: Mountain }, { name: 'Gamepad2', Icon: Gamepad2 }, { name: 'Sword', Icon: Sword },
  { name: 'Ghost', Icon: Ghost }, { name: 'Car', Icon: Car }, { name: 'Rocket', Icon: Rocket },
  { name: 'Shield', Icon: Shield }, { name: 'Zap', Icon: Zap }, { name: 'Music', Icon: Music },
  { name: 'Camera', Icon: Camera }, { name: 'Map', Icon: Map }, { name: 'Crown', Icon: Crown }, { name: 'Flame', Icon: Flame }
];

const STORAGE_KEY = 'nova_ps5_library_data';

// --- Components ---

// Fix: Added React.FC typing to allow standard props like 'key' in JSX
const IntroScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [hasSlammed, setHasSlammed] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(smoothY, [-500, 500], [15, -15]);
  const rotateY = useTransform(smoothX, [-500, 500], [-15, 15]);

  useEffect(() => {
    const t1 = setTimeout(() => setHasSlammed(true), 1200);
    const t2 = setTimeout(() => setShowButton(true), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div 
      style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
      }}
    >
      <motion.div style={{ perspective: 1000, rotateX: hasSlammed ? rotateX : 0, rotateY: hasSlammed ? rotateY : 0 }}>
        <motion.div initial={{ opacity: 0, scale: 5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
          <h1 className="ps-font-orbitron" style={{ fontSize: 'clamp(4rem, 15vw, 10rem)', fontWeight: 900, letterSpacing: '0.2em', fontStyle: 'italic', margin: 0 }}>NOVA</h1>
          <h2 className="ps-font-orbitron" style={{ fontSize: 'clamp(1.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '0.5em', color: 'var(--ps-blue)', textShadow: '0 0 20px rgba(0,102,255,0.8)', margin: 0 }}>STUDIOS</h2>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {showButton && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'absolute', bottom: '6rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button onClick={onComplete} className="ps-font-orbitron" style={{ padding: '1rem 3rem', border: '2px solid var(--ps-blue)', background: 'transparent', color: 'var(--ps-blue)', borderRadius: '9999px', cursor: 'pointer', fontWeight: 'bold' }}>START</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Fix: Added React.FC typing for consistency and proper JSX typing
const Header: React.FC<{ onOwnerClick: () => void; isOwner: boolean }> = ({ onOwnerClick, isOwner }) => (
  <header className="ps-header">
    <div>
      <h1 className="ps-text-white ps-font-orbitron">Nova Library</h1>
      <div className="ps-header-line" />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: 'rgba(255,255,255,0.6)' }}>
      <button onClick={onOwnerClick} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '9999px', border: isOwner ? '1px solid var(--ps-blue)' : '1px solid rgba(255,255,255,0.1)', backgroundColor: isOwner ? 'rgba(0,102,255,0.1)' : 'transparent', color: isOwner ? 'var(--ps-blue)' : 'inherit', cursor: 'pointer' }}>
        <ShieldCheck size={18} />
        <span>{isOwner ? 'Owner Mode' : 'Owner'}</span>
      </button>
      <Search size={24} style={{ cursor: 'pointer' }} />
      <Settings size={24} style={{ cursor: 'pointer' }} />
    </div>
  </header>
);

// Fix: Added React.FC typing to allow 'key' prop when mapped in a list
const GameTile: React.FC<{ game: any; isSelected: boolean; onHover: (game: any) => void }> = ({ game, isSelected, onHover }) => {
  const IconComponent = game.systemIcon ? (LucideIcons as any)[game.systemIcon] : null;
  return (
    <motion.div
      className={`ps-tile ${isSelected ? 'selected' : ''}`}
      onMouseEnter={() => onHover(game)}
      onMouseLeave={() => onHover(null)}
      onClick={() => window.open(game.link, '_blank')}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.1, translateY: -10 }}
    >
      {game.systemIcon && IconComponent ? (
        <div className="ps-tile-icon-bg">
          <IconComponent size={80} strokeWidth={1.5} style={{ filter: isSelected ? 'drop-shadow(0 0 15px var(--ps-blue-glow))' : 'none' }} />
        </div>
      ) : ( <img src={game.icon} alt={game.name} /> )}
      <div className="ps-tile-overlay">
        <p className="ps-text-white ps-font-bold" style={{ fontSize: '1.125rem', margin: 0 }}>{game.name}</p>
      </div>
      {isSelected && <div className="animate-ps-pulse" style={{ position: 'absolute', inset: 0, border: '4px solid var(--ps-blue)', borderRadius: '8px' }} />}
    </motion.div>
  );
};

// Fix: Added React.FC typing for consistency
const OwnerDashboard: React.FC<{ games: any[]; onClose: () => void; onUpdateGames: (games: any[]) => void; onLogout: () => void }> = ({ games, onClose, onUpdateGames, onLogout }) => {
  const [editingGame, setEditingGame] = useState<any>({});
  const [isAdding, setIsAdding] = useState(false);
  const [iconMode, setIconMode] = useState<'url' | 'system'>('url');

  const handleSave = () => {
    if (!editingGame.name || !editingGame.link) return alert('Name and Link required');
    const finalGame = { ...editingGame };
    if (iconMode === 'system') delete finalGame.icon; else delete finalGame.systemIcon;
    if (isAdding) onUpdateGames([...games, { ...finalGame, id: Date.now() }]);
    else onUpdateGames(games.map(g => g.id === finalGame.id ? finalGame : g));
    setEditingGame({}); setIsAdding(false);
  };

  return (
    <div className="ps-modal-overlay">
      <div style={{ width: '100%', maxWidth: '900px', backgroundColor: '#111', borderRadius: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center' }}>
          <h2 className="ps-font-orbitron" style={{ flex: 1, margin: 0 }}>Dashboard</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={onLogout} style={{ color: '#ff4444', background: 'none', border: '1px solid #422', cursor: 'pointer' }}>LOGOUT</button>
            <X size={24} onClick={onClose} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {(isAdding || editingGame.id) && (
            <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input className="ps-input" value={editingGame.name || ''} onChange={e => setEditingGame({...editingGame, name: e.target.value})} placeholder="Name" />
                <input className="ps-input" value={editingGame.link || ''} onChange={e => setEditingGame({...editingGame, link: e.target.value})} placeholder="Link" />
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <button onClick={() => setIconMode('url')} style={{ background: iconMode === 'url' ? 'var(--ps-blue)' : '#333', border: 'none', color: '#fff', padding: '0.5rem 1rem' }}>IMAGE</button>
                    <button onClick={() => setIconMode('system')} style={{ background: iconMode === 'system' ? 'var(--ps-blue)' : '#333', border: 'none', color: '#fff', padding: '0.5rem 1rem' }}>SYSTEM</button>
                  </div>
                  {iconMode === 'url' ? <input className="ps-input" value={editingGame.icon || ''} onChange={e => setEditingGame({...editingGame, icon: e.target.value})} placeholder="Image URL" /> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: '8px', padding: '10px', background: '#000' }}>
                      {SYSTEM_ICONS.map(({ name, Icon }) => (
                        <div key={name} onClick={() => setEditingGame({...editingGame, systemIcon: name})} style={{ padding: '5px', border: editingGame.systemIcon === name ? '2px solid blue' : 'none', cursor: 'pointer' }}><Icon size={20} /></div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button onClick={handleSave} className="ps-btn" style={{ marginTop: '1rem' }}>Save</button>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {games.map(g => (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', background: '#222', padding: '0.5rem' }}>
                <span style={{ flex: 1 }}>{g.name}</span>
                <button onClick={() => { setEditingGame(g); setIconMode(g.systemIcon ? 'system' : 'url'); }} style={{ color: 'var(--ps-blue)', border: 'none', background: 'none' }}>Edit</button>
                <button onClick={() => onUpdateGames(games.filter(x => x.id !== g.id))} style={{ color: '#f44', border: 'none', background: 'none' }}>Delete</button>
              </div>
            ))}
            <button onClick={() => { setEditingGame({}); setIsAdding(true); }} className="ps-btn">Add New Game</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [localGames, setLocalGames] = useState<any[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setLocalGames(saved ? JSON.parse(saved) : initialGames);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get('u') === 'nova' && f.get('p') === 'stacie2378') { setIsOwner(true); setShowLogin(false); setShowDashboard(true); }
    else alert('Invalid credentials.');
  };

  const bg = selectedGame?.background || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000";

  return (
    <div className="ps-app">
      <AnimatePresence mode="wait">
        {showIntro ? <IntroScreen key="intro" onComplete={() => setShowIntro(false)} /> : (
          <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-screen relative">
            <div className="ps-bg-layer">
              <AnimatePresence mode="wait">
                <motion.div key={bg} initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} className="absolute inset-0">
                  <div className="ps-bg-image" style={{ backgroundImage: `url(${bg})` }} />
                </motion.div>
              </AnimatePresence>
              <div className="ps-bg-overlay" /><div className="ps-radial-overlay" />
            </div>
            <div className="relative z-10 flex flex-col h-full">
              <Header isOwner={isOwner} onOwnerClick={() => isOwner ? setShowDashboard(true) : setShowLogin(true)} />
              <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ height: '12rem', padding: '0 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <AnimatePresence mode="wait">
                    {selectedGame && (
                      <motion.div key={selectedGame.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2 className="ps-text-white ps-font-bold ps-uppercase" style={{ fontSize: 'clamp(2rem, 8vw, 6rem)', margin: 0 }}>{selectedGame.name}</h2>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="ps-scroller-container">
                  <ChevronLeft size={48} onClick={() => scroll('left')} style={{ position: 'absolute', left: '1rem', top: '50%', zIndex: 30, cursor: 'pointer' }} />
                  <div ref={scrollRef} className="ps-scroller">
                    <div style={{ flexShrink: 0, width: '2rem' }} />
                    {localGames.map(g => <GameTile key={g.id} game={g} isSelected={selectedGame?.id === g.id} onHover={setSelectedGame} />)}
                    <div style={{ flexShrink: 0, width: '10rem' }} />
                  </div>
                  <ChevronRight size={48} onClick={() => scroll('right')} style={{ position: 'absolute', right: '1rem', top: '50%', zIndex: 30, cursor: 'pointer' }} />
                </div>
              </main>
              <footer style={{ padding: '2rem 3rem', display: 'flex', gap: '2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                <span>X LAUNCH</span><span>O BACK</span>
                <div style={{ marginLeft: 'auto', color: 'var(--ps-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="animate-ps-ping" style={{ width: '8px', height: '8px', background: 'currentColor', borderRadius: '50%' }} />
                  <span>NETWORK ONLINE</span>
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showLogin && (
        <div className="ps-modal-overlay">
          <div className="ps-card">
            <h3 className="ps-font-orbitron">SECURITY ACCESS</h3>
            <form onSubmit={handleLogin}>
              <input className="ps-input" name="u" placeholder="Username" required />
              <input className="ps-input" type="password" name="p" placeholder="Password" required style={{ margin: '1rem 0' }} />
              <button type="submit" className="ps-btn">VERIFY</button>
            </form>
          </div>
        </div>
      )}
      {showDashboard && isOwner && <OwnerDashboard games={localGames} onClose={() => setShowDashboard(false)} onLogout={() => {setIsOwner(false); setShowDashboard(false);}} onUpdateGames={(g) => {setLocalGames(g); localStorage.setItem(STORAGE_KEY, JSON.stringify(g));}} />}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
