import React from 'react';
import { motion } from 'framer-motion';

const MenuIcon = ({ isOpen, setIsOpen }) => {
  const lineAnimation = {
    closed: {
      rotate: 0,
      transformOrigin: 'bottom center',
    },
    open: (i) => ({
      rotate: i * 45,
      y: i *6,
      x: i * 3,
    }),
  };

  return (
    <motion.div
      className="flex flex-col gap-1 cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <motion.span
        className="text-black h-2"
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={lineAnimation}
        transition={{ duration: 0.3 }}
        custom={1}
      >
        ---
      </motion.span>

      <motion.span
        className="text-black h-2"
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={lineAnimation}
        transition={{ duration: 0.3, delay: 0.1 }}
        custom={-1}
      >
        ---
      </motion.span>
    </motion.div>
  );
};

export default MenuIcon;
