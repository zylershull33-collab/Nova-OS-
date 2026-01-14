
import React from 'react';
import { Settings, Search, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOwnerClick: () => void;
  isOwner: boolean;
}

const Header: React.FC<HeaderProps> = ({ onOwnerClick, isOwner }) => {
  return (
    <header className="ps-header">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 className="ps-text-white ps-font-orbitron">Nova Library</h1>
        <div className="ps-header-line" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: 'rgba(255,255,255,0.6)' }}>
        <button 
          onClick={onOwnerClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            border: isOwner ? '1px solid var(--ps-blue)' : '1px solid rgba(255,255,255,0.1)',
            backgroundColor: isOwner ? 'rgba(0,102,255,0.1)' : 'transparent',
            color: isOwner ? 'var(--ps-blue)' : 'inherit',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          <ShieldCheck size={18} />
          <span>{isOwner ? 'Owner Mode' : 'Owner'}</span>
        </button>
        <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
          <Search size={24} />
        </button>
        <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
          <Settings size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
