
import React from 'react';
import { Settings, Search, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOwnerClick: () => void;
  isOwner: boolean;
}

const Header: React.FC<HeaderProps> = ({ onOwnerClick, isOwner }) => {
  return (
    <header className="flex items-center justify-between px-6 py-8 sm:px-12">
      {/* Title */}
      <div className="flex flex-col">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-widest text-white font-['Orbitron'] uppercase">
          Nova Library
        </h1>
        <div className="h-1 w-32 bg-gradient-to-r from-[#0066ff] to-transparent mt-2 rounded-full" />
      </div>

      {/* Simplified Quick Nav Icons */}
      <div className="flex items-center space-x-4 sm:space-x-8 text-white/60">
        <button 
          onClick={onOwnerClick}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-300 font-bold uppercase tracking-widest text-xs
            ${isOwner 
              ? 'border-[#0066ff] text-[#0066ff] bg-[#0066ff]/10' 
              : 'border-white/10 hover:border-white/40 hover:text-white'
            }`}
        >
          <ShieldCheck size={18} />
          <span>{isOwner ? 'Owner Mode' : 'Owner'}</span>
        </button>
        <button className="hover:text-white transition-colors duration-200">
          <Search size={24} />
        </button>
        <button className="hover:text-white transition-colors duration-200">
          <Settings size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
