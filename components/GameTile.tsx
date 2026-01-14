
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameTileProps } from '../types';

const GameTile: React.FC<GameTileProps> = ({ game, isSelected, onHover }) => {
  return (
    <motion.div
      className="relative flex-shrink-0 group cursor-pointer snap-center sm:snap-start"
      onMouseEnter={() => onHover(game)}
      onMouseLeave={() => onHover(null)}
      onClick={() => window.open(game.link, '_blank')}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.1, translateY: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Tile Container */}
      <div className={`
        relative overflow-hidden rounded-lg w-[160px] h-[220px] sm:w-[220px] sm:h-[280px]
        border-2 transition-all duration-300
        ${isSelected 
          ? 'border-[#0066ff] shadow-[0_0_30px_rgba(0,102,255,0.7)] z-10' 
          : 'border-white/10 group-hover:border-white/50 shadow-lg'
        }
      `}>
        {/* Game Icon/Cover */}
        <img 
          src={game.icon} 
          alt={game.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Shine Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Text Overlay at Bottom */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end h-24">
          <p className="text-white font-bold text-sm sm:text-lg leading-tight drop-shadow-md">
            {game.name}
          </p>
        </div>

        {/* Selected Indicator Glow (Subtle pulse when idle and selected) */}
        {isSelected && (
          <motion.div 
            className="absolute inset-0 border-4 border-[#0066ff] rounded-lg pointer-events-none"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default GameTile;
