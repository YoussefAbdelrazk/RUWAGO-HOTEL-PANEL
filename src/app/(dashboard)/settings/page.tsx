'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/hooks/use-profile';
import { ChangeEmailForm } from './change-email-form';
import { ProfileForm } from './profile-form';

export default function SettingsPage() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='mt-2 h-4 w-96' />
        </div>
        <Skeleton className='h-96 w-full' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
        <p className='text-muted-foreground'>Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue='profile' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='email'>Change Email</TabsTrigger>
        </TabsList>

        <TabsContent value='profile' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your hotel profile information.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='email' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Change Email</CardTitle>
              <CardDescription>
                Change your email address. You&apos;ll receive an OTP to verify the new email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangeEmailForm currentEmail={profile?.email} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
