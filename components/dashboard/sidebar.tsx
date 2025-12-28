'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dumbbell,
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  ChevronDown,
  UserPlus,
  Library,
} from 'lucide-react';

const teacherNavItems = [
  { href: '/professor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/professor/cursos', label: 'Cursos', icon: BookOpen },
  { href: '/professor/convites', label: 'Convites', icon: UserPlus },
];

const studentNavItems = [
  { href: '/aluno', label: 'Meus Cursos', icon: LayoutDashboard },
  { href: '/aluno/catalogo', label: 'Catálogo', icon: Library },
];

interface SidebarProps {
  role: 'TEACHER' | 'STUDENT';
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const navItems = role === 'TEACHER' ? teacherNavItems : studentNavItems;
  const basePath = role === 'TEACHER' ? '/professor' : '/aluno';

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 bg-zinc-900 border-r border-zinc-800 flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <Link href={basePath} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-zinc-900" />
          </div>
          <span className="text-xl font-bold text-white">FitPro</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== basePath && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User menu */}
      <div className="p-4 border-t border-zinc-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-6 hover:bg-zinc-800"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={session?.user?.image || ''} />
                <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                  {session?.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.name || 'Usuário'}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {role === 'TEACHER' ? 'Professor' : 'Aluno'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
            <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-zinc-800">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-red-400 focus:text-red-300 focus:bg-zinc-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
