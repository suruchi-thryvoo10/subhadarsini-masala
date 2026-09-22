import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 }
};

interface RevealProps {
  children: React.ReactNode;
  /** Direction the element travels from. */
  from?: Direction;
  delay?: number;
  className?: string;
  /** Render as a list/grid container that staggers its Reveal.Item children. */
  as?: 'div' | 'section' | 'ul';
}

/**
 * Fades content in once as it scrolls into view.
 *
 * Respects `prefers-reduced-motion`: the animation collapses to a plain fade so
 * the page still works for anyone who has asked the OS for less movement.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  from = 'up',
  delay = 0,
  className,
  as = 'div'
}) => {
  const reduceMotion = useReducedMotion();
  const offset = reduceMotion ? OFFSET.none : OFFSET[from];
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } }
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const reducedItem: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

/** Grid/list wrapper whose <StaggerItem> children animate in one after another. */
export const StaggerGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <motion.div
    className={className}
    variants={staggerContainer}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 'some' }}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div className={className} variants={reduceMotion ? reducedItem : staggerItem}>
      {children}
    </motion.div>
  );
};
