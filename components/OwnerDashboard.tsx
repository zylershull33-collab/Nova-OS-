
import React, { useState } from 'react';
import { X, Plus, Trash2, Mountain, Gamepad2, Sword, Ghost, Car, Rocket, Shield, Zap, Music, Camera, Map, Crown, Flame } from 'lucide-react';
import { Game } from '../types';

interface OwnerDashboardProps {
  games: Game[];
  onClose: () => void;
  onUpdateGames: (newGames: Game[]) => void;
  onLogout: () => void;
}

const SYSTEM_ICONS = [
  { name: 'Mountain', Icon: Mountain },
  { name: 'Gamepad2', Icon: Gamepad2 },
  { name: 'Sword', Icon: Sword },
  { name: 'Ghost', Icon: Ghost },
  { name: 'Car', Icon: Car },
  { name: 'Rocket', Icon: Rocket },
  { name: 'Shield', Icon: Shield },
  { name: 'Zap', Icon: Zap },
  { name: 'Music', Icon: Music },
  { name: 'Camera', Icon: Camera },
  { name: 'Map', Icon: Map },
  { name: 'Crown', Icon: Crown },
  { name: 'Flame', Icon: Flame }
];

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ games, onClose, onUpdateGames, onLogout }) => {
  const [editingGame, setEditingGame] = useState<Partial<Game>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [iconMode, setIconMode] = useState<'url' | 'system'>('url');

  const handleDelete = (id: number) => {
    if (confirm('Are you sure?')) {
      onUpdateGames(games.filter(g => g.id !== id));
    }
  };

  const handleSave = () => {
    if (!editingGame.name || !editingGame.link) {
      alert('Name and Link are required.');
      return;
    }
    
    if (iconMode === 'url' && !editingGame.icon) {
      alert('Icon URL is required in URL mode.');
      return;
    }

    if (iconMode === 'system' && !editingGame.systemIcon) {
      alert('Please select an icon.');
      return;
    }

    // Clean up
    const finalGame = { ...editingGame };
    if (iconMode === 'system') {
      delete finalGame.icon;
    } else {
      delete finalGame.systemIcon;
    }

    if (isAdding) {
      onUpdateGames([...games, { ...finalGame as Game, id: Date.now() }]);
    } else {
      onUpdateGames(games.map(g => g.id === finalGame.id ? (finalGame as Game) : g));
    }
    setEditingGame({});
    setIsAdding(false);
  };

  const startEditing = (game: Game) => {
    setEditingGame(game);
    setIsAdding(false);
    setIconMode(game.systemIcon ? 'system' : 'url');
  };

  const startAdding = () => {
    setEditingGame({});
    setIsAdding(true);
    setIconMode('url');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}>
      <div style={{ width: '100%', maxWidth: '900px', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', background: 'linear-gradient(to right, rgba(0,102,255,0.1), transparent)' }}>
          <div style={{ flex: 1 }}>
            <h2 className="ps-font-orbitron" style={{ fontSize: '1.25rem', margin: 0 }}>Dashboard</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={onLogout} style={{ fontSize: '10px', color: '#ff4444', background: 'none', border: '1px solid rgba(255,0,0,0.2)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>LOGOUT</button>
            <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {(isAdding || editingGame.id) && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid rgba(0,102,255,0.3)', marginBottom: '2rem' }}>
              <h3 className="ps-text-blue" style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem' }}>{isAdding ? 'Add Game' : 'Edit Game'}</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Game Name</label>
                    <input className="ps-input" value={editingGame.name || ''} onChange={e => setEditingGame({...editingGame, name: e.target.value})} placeholder="e.g. Elden Ring" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Destination Link</label>
                    <input className="ps-input" value={editingGame.link || ''} onChange={e => setEditingGame({...editingGame, link: e.target.value})} placeholder="https://..." />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Custom Background URL</label>
                    <input className="ps-input" value={editingGame.background || ''} onChange={e => setEditingGame({...editingGame, background: e.target.value})} placeholder="https://..." />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Icon Selection</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      <button 
                        onClick={() => setIconMode('url')} 
                        style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', fontSize: '10px', border: 'none', cursor: 'pointer', background: iconMode === 'url' ? 'var(--ps-blue)' : '#222', color: '#fff' }}
                      >
                        IMAGE URL
                      </button>
                      <button 
                        onClick={() => setIconMode('system')} 
                        style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', fontSize: '10px', border: 'none', cursor: 'pointer', background: iconMode === 'system' ? 'var(--ps-blue)' : '#222', color: '#fff' }}
                      >
                        SYSTEM ICONS
                      </button>
                    </div>

                    {iconMode === 'url' ? (
                      <input className="ps-input" value={editingGame.icon || ''} onChange={e => setEditingGame({...editingGame, icon: e.target.value})} placeholder="https://image-url.jpg" />
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(45px, 1fr))', gap: '8px', padding: '10px', backgroundColor: '#000', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                        {SYSTEM_ICONS.map(({ name, Icon }) => (
                          <button
                            key={name}
                            onClick={() => setEditingGame({...editingGame, systemIcon: name})}
                            style={{
                              aspectRatio: '1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '6px',
                              border: editingGame.systemIcon === name ? '2px solid var(--ps-blue)' : '1px solid rgba(255,255,255,0.1)',
                              backgroundColor: editingGame.systemIcon === name ? 'rgba(0,102,255,0.1)' : 'transparent',
                              color: editingGame.systemIcon === name ? 'var(--ps-blue)' : 'rgba(255,255,255,0.6)',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            title={name}
                          >
                            <Icon size={20} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={() => { setEditingGame({}); setIsAdding(false); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                <button onClick={handleSave} className="ps-btn" style={{ width: 'auto', padding: '0.5rem 1.5rem' }}>Save Changes</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', flex: 1 }}>Current Games</h3>
            {!isAdding && !editingGame.id && (
              <button onClick={startAdding} className="ps-text-blue" style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                <Plus size={16} /> ADD NEW
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {games.map(game => (
              <div key={game.id} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                {game.systemIcon ? (
                  <div style={{ width: '2.5rem', height: '3.5rem', borderRadius: '4px', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ps-blue)' }}>
                    {(() => {
                      const Match = SYSTEM_ICONS.find(i => i.name === game.systemIcon);
                      return Match ? <Match.Icon size={18} /> : null;
                    })()}
                  </div>
                ) : (
                  <img src={game.icon} style={{ width: '2.5rem', height: '3.5rem', objectFit: 'cover', borderRadius: '4px' }} />
                )}
                
                <div style={{ flex: 1, marginLeft: '1rem' }}>
                  <h4 style={{ margin: 0, fontSize: '14px' }}>{game.name}</h4>
                  <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{game.systemIcon ? 'System Icon' : 'External Image'}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => startEditing(game)} style={{ color: 'var(--ps-blue)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                  <button onClick={() => handleDelete(game.id)} style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
