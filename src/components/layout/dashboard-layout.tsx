'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Home, Hotel, LogOut, Menu, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Add class to html element to enable overflow-y: hidden for dashboard
  useEffect(() => {
    document.documentElement.classList.add('dashboard-overflow-hidden');
    return () => {
      document.documentElement.classList.remove('dashboard-overflow-hidden');
    };
  }, []);

  // const handleLogout = async () => {
  //   tokenStorage.removeTokens();
  //   await logout();
  //   router.push('/login');
  // };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/rooms', label: 'Rooms', icon: Hotel },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className='flex h-screen overflow-hidden bg-background'>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } border-r bg-card transition-all duration-300 overflow-hidden`}
      >
        <div className='flex h-full flex-col'>
          <div className='flex h-16 items-center border-b px-6'>
            <h1 className='text-xl font-bold'>Ruwago Hotel</h1>
          </div>
          <nav className='flex-1 space-y-1 p-4'>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className='w-full justify-start'
                  >
                    <Icon className='mr-2 h-4 w-4' />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
          <div className='border-t p-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='w-full justify-start'>
                  <User className='mr-2 h-4 w-4' />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem >
                  <LogOut className='mr-2 h-4 w-4' />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Header */}
        <header className='flex h-16 items-center border-b bg-card px-6'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='mr-4'
          >
            <Menu className='h-5 w-5' />
          </Button>
          <div className='flex flex-1 items-center justify-between'>
            <h2 className='text-lg font-semibold'>
              {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 overflow-y-auto p-6'>{children}</main>
      </div>
    </div>
  );
}
