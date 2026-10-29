'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function FadeInUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  yOffset?: number;
}) {
  return (
    <div
      className={`animate-fade-in ${className}`}
      style={delay ? { animationDelay: `${delay}s`, animationFillMode: 'both' } : undefined}
    >
      {children}
    </div>
  );
}

export function StaggerContainer({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`animate-fade-in ${className}`}>{children}</div>;
}

export function TiltPolaroid({
  children,
  className = '',
  initialRotate = -1.5,
}: {
  children: React.ReactNode;
  className?: string;
  initialRotate?: number;
}) {
  return (
    <motion.div
      style={{ rotate: initialRotate }}
      whileHover={{
        rotate: 0,
        scale: 1.025,
        y: -6,
        transition: { type: 'spring', stiffness: 260, damping: 20 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
