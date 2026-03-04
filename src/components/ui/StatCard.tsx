import React, { useEffect, useRef, useState } from 'react';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  subtitle?: string;
  color?: 'primary' | 'teal' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  prefix?: string;
  suffix?: string;
  formatAsCurrency?: boolean;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function StatCard({ title, value, icon, subtitle, color = 'primary', prefix = '', suffix = '', formatAsCurrency = false }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const startValue = useRef(0);

  useEffect(() => {
    startValue.current = displayValue;
    startTime.current = null;
    const duration = 900;

    const animate = (now: number) => {
      if (!startTime.current) startTime.current = now;
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue.current + (value - startValue.current) * eased));
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const display = formatAsCurrency
    ? `Rs.${Number(displayValue).toLocaleString()}`
    : `${prefix}${formatNumber(displayValue)}${suffix}`;

  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-body">
        <p className="stat-card-title">{title}</p>
        <p className="stat-card-value">{display}</p>
        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
      </div>
      <div className="stat-card-glow" />
    </div>
  );
}
