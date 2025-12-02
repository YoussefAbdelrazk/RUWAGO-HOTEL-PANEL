'use client';

import { StatCard } from '@/components/shared/stat-card';
import { useStatistics } from '@/hooks/use-statistics';
import { Calendar, DollarSign, Hotel, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { data: statistics, isLoading } = useStatistics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <p className='text-muted-foreground'>Welcome to your hotel management panel</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
        <StatCard
          title='Total Rooms'
          value={statistics?.totalRooms ?? 0}
          description='All rooms in your hotel'
          icon={Hotel}
          isLoading={isLoading}
        />
        <StatCard
          title='Available Rooms'
          value={statistics?.totalAvailablesRooms ?? 0}
          description='Currently available'
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <StatCard
          title='Confirmed Bookings'
          value={statistics?.totalConfirmedBooking ?? 0}
          description='Active confirmed bookings'
          icon={Calendar}
          isLoading={isLoading}
        />
        <StatCard
          title='Pending Bookings'
          value={statistics?.totalPendingBooking ?? 0}
          description='Awaiting confirmation'
          icon={Calendar}
          isLoading={isLoading}
        />
        <StatCard
          title='Total Revenue'
          value={formatCurrency(statistics?.totalMoney ?? 0)}
          description='Total money earned'
          icon={DollarSign}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
