'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, BarChart3, Users } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isAdminActive = pathname === '/admin' || pathname.startsWith('/admin/');
  const isTeacherActive = pathname === '/teacher' || pathname.startsWith('/teacher/');

  const navItems = [
    {
      label: 'Admin Dashboard',
      href: '/admin',
      icon: BarChart3,
      isActive: isAdminActive,
    },
    {
      label: 'Teacher Analysis',
      href: '/teacher',
      icon: Users,
      isActive: isTeacherActive,
    },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-slate-900 text-white rounded-lg"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-4 top-4 h-[calc(100vh-3rem)] w-64 shadow-xl transition-transform duration-300 z-40 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--color-sidebar)', color: 'var(--color-sidebar-foreground)' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b text-center" style={{ borderColor: 'var(--color-sidebar-border)' }}>
            <div className="w-28 h-28 relative mx-auto">
              <Image
                src="/savra-logo.webp"
                alt="Savra logo"
                fill
                sizes="112px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 px-4 py-6">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-muted-foreground)' }}>Main</p>
            <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors ${
                    item.isActive
                      ? 'text-[var(--color-sidebar-primary-foreground)] bg-[var(--color-sidebar-primary)]'
                      : 'text-[var(--color-sidebar-foreground)] hover:bg-[rgba(255,255,255,0.03)]'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t ml-6" style={{ borderColor: 'var(--color-sidebar-border)' }}>
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
              Made by Mohd Arish Khan 
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
