'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Menu,
  Dumbbell,
  LayoutDashboard,
  BookOpen,
  UserPlus,
  Library,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const teacherNavItems = [
  { href: '/professor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/professor/cursos', label: 'Cursos', icon: BookOpen },
  { href: '/professor/convites', label: 'Convites', icon: UserPlus },
];

const studentNavItems = [
  { href: '/aluno', label: 'Meus Cursos', icon: LayoutDashboard },
  { href: '/aluno/catalogo', label: 'Catálogo', icon: Library },
];

interface MobileHeaderProps {
  role: 'TEACHER' | 'STUDENT';
}

export function MobileHeader({ role }: MobileHeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const navItems = role === 'TEACHER' ? teacherNavItems : studentNavItems;
  const basePath = role === 'TEACHER' ? '/professor' : '/aluno';

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-zinc-800">
      <div className="flex items-center justify-between p-4">
        <Link href={basePath} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-zinc-900" />
          </div>
          <span className="text-lg font-bold text-white">FitPro</span>
        </Link>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-zinc-900 border-zinc-800 p-0">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="p-6 border-b border-zinc-800">
                <Link
                  href={basePath}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3"
                >
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
                      onClick={() => setIsOpen(false)}
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
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-zinc-900 border-zinc-800"
                  >
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
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

