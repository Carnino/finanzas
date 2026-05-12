'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PieChart } from 'lucide-react';

const items = [
  { href: '/', label: 'Inicio', Icon: Home },
  { href: '/stats', label: 'Stats', Icon: PieChart },
] as const;

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'calc(var(--nav-height) + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'rgba(10, 10, 10, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      {items.map(({ href, label, Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '0.5rem 1.25rem',
              color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.45)',
              transition: 'color 0.2s',
            }}
          >
            <Icon size={22} />
            <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
