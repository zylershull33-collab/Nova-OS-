
import React, { useState } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { Game } from '../types';

interface OwnerDashboardProps {
  games: Game[];
  onClose: () => void;
  onUpdateGames: (newGames: Game[]) => void;
  onLogout: () => void;
}

// Pre-made icon library with vertical (3:4) cover art
const PREMADE_ICONS = [
  { name: 'Mountain', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
  { name: 'Space', url: 'https://images.unsplash.com/photo-1614728263952-84ea206f25b6?q=80&w=800&auto=format&fit=crop' },
  { name: 'Cyber City', url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop' },
  { name: 'Forest', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop' },
  { name: 'Racing', url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop' },
  { name: 'Abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop' },
  { name: 'Knight', url: 'https://images.unsplash.com/photo-1519074063912-ad2a0522708f?q=80&w=800&auto=format&fit=crop' },
  { name: 'Magic', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop' },
];

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ games, onClose, onUpdateGames, onLogout }) => {
  const [editingGame, setEditingGame] = useState<Partial<Game>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [showIconLibrary, setShowIconLibrary] = useState(false);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this game?')) {
      onUpdateGames(games.filter(g => g.id !== id));
    }
  };

  const handleSave = () => {
    if (!editingGame.name || !editingGame.icon || !editingGame.link) {
      alert('Please fill in Name, Icon URL, and Link.');
      return;
    }

    if (isAdding) {
      const newGame: Game = {
        ...editingGame as Game,
        id: Date.now(),
      };
      onUpdateGames([...games, newGame]);
    } else {
      onUpdateGames(games.map(g => g.id === editingGame.id ? (editingGame as Game) : g));
    }
    
    setEditingGame({});
    setIsAdding(false);
    setShowIconLibrary(false);
  };

  const selectPremadeIcon = (url: string) => {
    setEditingGame({ ...editingGame, icon: url });
    setShowIconLibrary(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl bg-[#111] border border-white/10 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#0066ff]/10 to-transparent">
          <div>
            <h2 className="text-2xl font-bold font-['Orbitron'] text-white">OWNER CONTROL PANEL</h2>
            <p className="text-white/40 text-sm tracking-widest uppercase mt-1">Manage Library Contents</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onLogout}
              className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest border border-red-500/20 px-3 py-1 rounded"
            >
              Logout
            </button>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-8 no-scrollbar">
          {/* Form */}
          {(isAdding || editingGame.id) && (
            <div className="bg-white/5 p-6 rounded-xl border border-[#0066ff]/30 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[#0066ff] font-bold uppercase tracking-widest text-sm">
                  {isAdding ? 'Add New Game' : 'Edit Game'}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 uppercase font-bold">Game Name</label>
                  <input 
                    type="text" 
                    value={editingGame.name || ''} 
                    onChange={e => setEditingGame({...editingGame, name: e.target.value})}
                    placeholder="e.g. Gran Turismo 7"
                    className="w-full bg-black border border-white/10 rounded p-2 text-white text-sm focus:border-[#0066ff] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-white/40 uppercase font-bold">Icon URL</label>
                    <button 
                      onClick={() => setShowIconLibrary(!showIconLibrary)}
                      className="text-[10px] text-[#0066ff] font-bold hover:underline uppercase flex items-center space-x-1"
                    >
                      <ImageIcon size={10} />
                      <span>{showIconLibrary ? 'Hide Library' : 'Browse Library'}</span>
                    </button>
                  </div>
                  
                  {showIconLibrary ? (
                    <div className="grid grid-cols-4 gap-2 p-2 bg-black/40 rounded border border-white/10 max-h-40 overflow-y-auto no-scrollbar">
                      {PREMADE_ICONS.map((item) => (
                        <button 
                          key={item.name}
                          onClick={() => selectPremadeIcon(item.url)}
                          className="relative group aspect-[3/4] overflow-hidden rounded border border-white/10 hover:border-[#0066ff] transition-all"
                        >
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] font-bold text-white uppercase tracking-tighter text-center px-1">
                            {item.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      value={editingGame.icon || ''} 
                      onChange={e => setEditingGame({...editingGame, icon: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-black border border-white/10 rounded p-2 text-white text-sm focus:border-[#0066ff] outline-none"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 uppercase font-bold">Play Link</label>
                  <input 
                    type="text" 
                    value={editingGame.link || ''} 
                    onChange={e => setEditingGame({...editingGame, link: e.target.value})}
                    placeholder="https://..."
                    className="w-full bg-black border border-white/10 rounded p-2 text-white text-sm focus:border-[#0066ff] outline-none"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 uppercase font-bold">Background URL (16:9)</label>
                  <input 
                    type="text" 
                    value={editingGame.background || ''} 
                    onChange={e => setEditingGame({...editingGame, background: e.target.value})}
                    placeholder="https://..."
                    className="w-full bg-black border border-white/10 rounded p-2 text-white text-sm focus:border-[#0066ff] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  onClick={() => { setEditingGame({}); setIsAdding(false); setShowIconLibrary(false); }}
                  className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-[#0066ff] text-white text-xs font-bold rounded hover:bg-[#0052cc] transition-colors uppercase tracking-widest"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white/60 font-bold uppercase tracking-widest text-xs">Current Library</h3>
              {!isAdding && !editingGame.id && (
                <button 
                  onClick={() => { setEditingGame({}); setIsAdding(true); }}
                  className="flex items-center space-x-2 text-[#0066ff] text-xs font-bold hover:text-white transition-colors"
                >
                  <Plus size={16} />
                  <span>Add New Entry</span>
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {games.map(game => (
                <div key={game.id} className="group flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-all">
                  <div className="flex items-center space-x-4">
                    <img src={game.icon} alt={game.name} className="w-10 h-12 object-cover rounded border border-white/10" />
                    <div>
                      <h4 className="text-white font-bold text-sm">{game.name}</h4>
                      <p className="text-white/30 text-[10px] truncate max-w-[200px]">{game.link}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingGame(game)}
                      className="p-2 text-white/60 hover:text-[#0066ff] transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(game.id)}
                      className="p-2 text-white/40 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {games.length === 0 && (
                <div className="py-12 text-center text-white/20 uppercase tracking-widest text-sm">
                  The library is currently empty.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
