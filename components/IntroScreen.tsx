
import React, { useState, useEffect } from 'react';
// Added AnimatePresence to framer-motion imports to fix undefined component errors
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [hasSlammed, setHasSlammed] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Mouse tracking logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse tracking
  const springConfig = { damping: 30, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Rotation transforms based on mouse position
  const rotateX = useTransform(smoothY, [-500, 500], [15, -15]);
  const rotateY = useTransform(smoothX, [-500, 500], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  useEffect(() => {
    // Sequence of animations
    const timer = setTimeout(() => setHasSlammed(true), 1200);
    const timer2 = setTimeout(() => setShowButton(true), 2500);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden cursor-default"
      onMouseMove={handleMouseMove}
    >
      {/* Background Particles/Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0066ff]/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Main Cinematic Text Container */}
      <motion.div
        style={{
          perspective: 1000,
          rotateX: hasSlammed ? rotateX : 0,
          rotateY: hasSlammed ? rotateY : 0,
        }}
        className="relative z-10 select-none pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 5, filter: 'blur(40px)' }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            filter: 'blur(0px)',
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.175, 0.885, 0.32, 1.275], // Custom bounce for the 'slam'
            delay: 0.4
          }}
          onAnimationComplete={() => {
            // Optional: trigger haptic or sound here
          }}
          className="relative"
        >
          {/* Main Text */}
          <h1 className="text-7xl sm:text-9xl font-black font-['Orbitron'] tracking-[0.2em] text-white italic">
            NOVA
          </h1>
          <h2 className="text-3xl sm:text-5xl font-bold font-['Orbitron'] tracking-[0.5em] text-[#0066ff] mt-[-10px] ml-4 drop-shadow-[0_0_20px_rgba(0,102,255,0.8)]">
            STUDIOS
          </h2>

          {/* Slam Shockwave Effect */}
          {hasSlammed && (
            <motion.div
              initial={{ opacity: 0.8, scale: 0.5 }}
              animate={{ opacity: 0, scale: 2.5 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 border-4 border-[#0066ff] rounded-full blur-sm"
            />
          )}
        </motion.div>
      </motion.div>

      {/* Interactive Subtext Glow (Follows mouse) */}
      {hasSlammed && (
        <motion.div 
          style={{ x: smoothX, y: smoothY }}
          className="absolute w-40 h-40 bg-[#0066ff]/20 blur-3xl rounded-full pointer-events-none mix-blend-screen"
        />
      )}

      {/* Get Started Button */}
      {/* Wrapped with AnimatePresence to fix 'Cannot find name' errors */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-24 flex flex-col items-center space-y-4"
          >
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#0066ff', color: '#fff' }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="px-12 py-4 border-2 border-[#0066ff] text-[#0066ff] font-['Orbitron'] font-bold uppercase tracking-[0.3em] rounded-full transition-colors shadow-[0_0_30px_rgba(0,102,255,0.2)]"
            >
              Get Started
            </motion.button>
            <motion.p 
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold"
            >
              System Ready // Press to Enter
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes subtle-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default IntroScreen;
