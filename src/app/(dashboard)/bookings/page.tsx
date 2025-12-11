'use client';

import { TableSkeleton } from '@/components/shared/table-skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useApproveBooking, useBookings, useRejectBooking } from '@/hooks/use-bookings';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BookingsPage() {
  const { data: bookings = [], isLoading } = useBookings();
  const approveBookingMutation = useApproveBooking();
  const rejectBookingMutation = useRejectBooking();
  const [rejectingBooking, setRejectingBooking] = useState<{
    id: number;
    cancelReason: string;
  } | null>(null);

  const handleApprove = async (bookingId: number) => {
    try {
      await approveBookingMutation.mutateAsync(bookingId);
      toast.success('Booking approved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve booking';
      toast.error('Approval Failed', {
        description: errorMessage,
      });
    }
  };

  const handleReject = async () => {
    if (!rejectingBooking) return;
    try {
      await rejectBookingMutation.mutateAsync({
        bookingId: rejectingBooking.id,
        data: {
          cancelReason: rejectingBooking.cancelReason || undefined,
        },
      });
      toast.success('Booking rejected successfully');
      setRejectingBooking(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reject booking';
      toast.error('Rejection Failed', {
        description: errorMessage,
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Completed':
        return 'default';
      case 'Booked':
      case 'Check_in':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Bookings</h1>
            <p className='text-muted-foreground'>Manage hotel bookings</p>
          </div>
        </div>
        <div className='rounded-md border p-4'>
          <TableSkeleton rows={5} columns={9} />
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Bookings</h1>
          <p className='text-muted-foreground'>Manage hotel bookings</p>
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className='text-center py-8 text-muted-foreground'>
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell className='font-medium'>{booking.id}</TableCell>
                  <TableCell>{booking.propTitle}</TableCell>
                  <TableCell>{formatDate(booking.checkIn)}</TableCell>
                  <TableCell>{formatDate(booking.checkOut)}</TableCell>
                  <TableCell>{formatCurrency(booking.subtotal)}</TableCell>
                  <TableCell>{formatCurrency(booking.tax)}</TableCell>
                  <TableCell className='font-semibold'>{formatCurrency(booking.total)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(booking.bookStatus)}>
                      {booking.bookStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleApprove(booking.id)}
                        disabled={
                          approveBookingMutation.isPending || booking.bookStatus !== 'Booked'
                        }
                        className='h-8'
                      >
                        <CheckCircle2 className='mr-2 h-4 w-4 text-green-600' />
                        Approve
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => setRejectingBooking({ id: booking.id, cancelReason: '' })}
                        disabled={
                          rejectBookingMutation.isPending || booking.bookStatus !== 'Booked'
                        }
                        className='h-8'
                      >
                        <XCircle className='mr-2 h-4 w-4' />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Reject Booking Dialog */}
      {rejectingBooking && (
        <Dialog open={!!rejectingBooking} onOpenChange={() => setRejectingBooking(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Booking</DialogTitle>
              <DialogDescription>
                Please provide a cancellation reason for rejecting this booking.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='cancelReason'>Cancellation Reason (Optional)</Label>
                <Input
                  id='cancelReason'
                  placeholder='Enter cancellation reason'
                  value={rejectingBooking.cancelReason}
                  onChange={e =>
                    setRejectingBooking({
                      ...rejectingBooking,
                      cancelReason: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setRejectingBooking(null)}
                disabled={rejectBookingMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={handleReject}
                disabled={rejectBookingMutation.isPending}
              >
                {rejectBookingMutation.isPending ? 'Rejecting...' : 'Reject Booking'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
