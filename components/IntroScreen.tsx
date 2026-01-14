
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [hasSlammed, setHasSlammed] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

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
    const timer = setTimeout(() => setHasSlammed(true), 1200);
    const timer2 = setTimeout(() => setShowButton(true), 2500);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div 
      style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="animate-ps-pulse" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', backgroundColor: 'rgba(0,102,255,0.05)', filter: 'blur(120px)', borderRadius: '50%' }} />
      </div>

      <motion.div
        style={{
          perspective: 1000,
          rotateX: hasSlammed ? rotateX : 0,
          rotateY: hasSlammed ? rotateY : 0,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 5, filter: 'blur(40px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275], delay: 0.4 }}
          style={{ position: 'relative' }}
        >
          <h1 className="ps-font-orbitron" style={{ fontSize: 'clamp(4rem, 15vw, 10rem)', fontWeight: 900, letterSpacing: '0.2em', color: '#fff', fontStyle: 'italic', margin: 0 }}>
            NOVA
          </h1>
          <h2 className="ps-font-orbitron" style={{ fontSize: 'clamp(1.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '0.5em', color: 'var(--ps-blue)', marginTop: '-10px', marginLeft: '1rem', textShadow: '0 0 20px rgba(0,102,255,0.8)', margin: 0 }}>
            STUDIOS
          </h2>

          {hasSlammed && (
            <motion.div
              initial={{ opacity: 0.8, scale: 0.5 }}
              animate={{ opacity: 0, scale: 2.5 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ position: 'absolute', inset: 0, border: '4px solid var(--ps-blue)', borderRadius: '50%', filter: 'blur(4px)' }}
            />
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ position: 'absolute', bottom: '6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
          >
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'var(--ps-blue)', color: '#fff' }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="ps-font-orbitron"
              style={{ padding: '1rem 3rem', border: '2px solid var(--ps-blue)', background: 'transparent', color: 'var(--ps-blue)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.3em', borderRadius: '9999px', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 0 30px rgba(0,102,255,0.2)' }}
            >
              Start
            </motion.button>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.4em', fontWeight: 'bold' }}>
              Press to Enter
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntroScreen;
