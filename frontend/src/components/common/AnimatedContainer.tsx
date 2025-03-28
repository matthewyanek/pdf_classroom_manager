// src/components/AnimatedContainer.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedContainerProps {
  children: React.ReactNode;
  key: string | number;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ children, key }) => {
  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;