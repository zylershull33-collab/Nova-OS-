
import React from 'react';
import { motion } from 'framer-motion';
import { GameTileProps } from '../types';

const GameTile: React.FC<GameTileProps> = ({ game, isSelected, onHover }) => {
  return (
    <motion.div
      className={`ps-tile ${isSelected ? 'selected' : ''}`}
      onMouseEnter={() => onHover(game)}
      onMouseLeave={() => onHover(null)}
      onClick={() => window.open(game.link, '_blank')}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.1, translateY: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Game Icon/Cover */}
      <img src={game.icon} alt={game.name} />

      {/* Shine Effect Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.05), transparent)', opacity: isSelected ? 1 : 0, transition: 'opacity 0.5s' }} />

      {/* Text Overlay at Bottom */}
      <div className="ps-tile-overlay">
        <p className="ps-text-white ps-font-bold" style={{ fontSize: '1.125rem', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {game.name}
        </p>
      </div>

      {/* Selected Indicator Glow */}
      {isSelected && (
        <motion.div 
          className="animate-ps-pulse"
          style={{ position: 'absolute', inset: 0, border: '4px solid var(--ps-blue)', borderRadius: '8px', pointerEvents: 'none' }}
        />
      )}
    </motion.div>
  );
};

export default GameTile;
