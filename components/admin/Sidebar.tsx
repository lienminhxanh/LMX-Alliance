'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Settings, Home, Layers, Newspaper,
  Briefcase, TrendingUp, Users2, Handshake, FolderOpen,
  Image, MessageSquare, Users, FileText, LogOut, ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/homepage/hero', label: 'Homepage Builder', icon: Home },
  { href: '/admin/sectors', label: 'Business Sectors', icon: Layers },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/shareholder-relations/messages', label: 'Shareholder Relations', icon: TrendingUp },
  { href: '/admin/leadership', label: 'Leadership', icon: Users2 },
  { href: '/admin/partners', label: 'Partners', icon: Handshake },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/media', label: 'Media Library', icon: Image },
  { href: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings/company', label: 'Settings', icon: Settings },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-[#1F2937] flex flex-col h-screen sticky top-0 overflow-y-auto flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-700">
        <div className="w-7 h-7 bg-white flex items-center justify-center">
          <span className="text-[#1F2937] text-xs font-bold">LMX</span>
        </div>
        <div>
          <p className="text-white text-sm font-semibold leading-none">LMX Alliance</p>
          <p className="text-gray-400 text-xs mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-5 py-2.5 text-sm transition-colors',
                active
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={15} className="flex-shrink-0" />
              <span className="flex-1 truncate">{label}</span>
              {active && <ChevronRight size={12} className="text-gray-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-gray-700 p-3">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-400 hover:text-white w-full transition-colors"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
