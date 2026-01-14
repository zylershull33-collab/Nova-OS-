
import React, { useState } from 'react';
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { Game } from '../types';

interface OwnerDashboardProps {
  games: Game[];
  onClose: () => void;
  onUpdateGames: (newGames: Game[]) => void;
  onLogout: () => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ games, onClose, onUpdateGames, onLogout }) => {
  const [editingGame, setEditingGame] = useState<Partial<Game>>({});
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure?')) {
      onUpdateGames(games.filter(g => g.id !== id));
    }
  };

  const handleSave = () => {
    if (!editingGame.name || !editingGame.icon || !editingGame.link) {
      alert('Fill all required fields.');
      return;
    }
    if (isAdding) {
      onUpdateGames([...games, { ...editingGame as Game, id: Date.now() }]);
    } else {
      onUpdateGames(games.map(g => g.id === editingGame.id ? (editingGame as Game) : g));
    }
    setEditingGame({});
    setIsAdding(false);
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input className="ps-input" value={editingGame.name || ''} onChange={e => setEditingGame({...editingGame, name: e.target.value})} placeholder="Name" />
                <input className="ps-input" value={editingGame.icon || ''} onChange={e => setEditingGame({...editingGame, icon: e.target.value})} placeholder="Icon URL" />
                <input className="ps-input" value={editingGame.link || ''} onChange={e => setEditingGame({...editingGame, link: e.target.value})} placeholder="Link" />
                <input className="ps-input" value={editingGame.background || ''} onChange={e => setEditingGame({...editingGame, background: e.target.value})} placeholder="Background (Optional)" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={() => { setEditingGame({}); setIsAdding(false); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                <button onClick={handleSave} className="ps-btn" style={{ width: 'auto', padding: '0.5rem 1.5rem' }}>Save</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', flex: 1 }}>Current Games</h3>
            {!isAdding && !editingGame.id && (
              <button onClick={() => setIsAdding(true)} className="ps-text-blue" style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                <Plus size={16} /> ADD NEW
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {games.map(game => (
              <div key={game.id} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <img src={game.icon} style={{ width: '2.5rem', height: '3.5rem', objectFit: 'cover', borderRadius: '4px' }} />
                <div style={{ flex: 1, marginLeft: '1rem' }}>
                  <h4 style={{ margin: 0, fontSize: '14px' }}>{game.name}</h4>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setEditingGame(game)} style={{ color: 'var(--ps-blue)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
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
