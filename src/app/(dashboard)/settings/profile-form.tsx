'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useFacilities } from '@/hooks/use-facilities';
import { useUpdateProfile } from '@/hooks/use-profile';
import { updateProfileSchema, type UpdateProfileFormData } from '@/lib/schemes/profile';
import type { Profile } from '@/lib/types/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface ProfileFormProps {
  profile: Profile | null | undefined;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const updateProfileMutation = useUpdateProfile();
  const { data: facilities = [], isLoading: facilitiesLoading } = useFacilities();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      hotelName: profile?.hotelName || '',
      description: profile?.description || '',
      location: profile?.location || '',
      additionalEmail: profile?.additionalEmail || '',
      mobile: profile?.mobile || '',
      additionalMobile: profile?.additionalMobile || '',
      nearestAirportName: profile?.nearestAirportName || '',
      nearestAirportKm: profile?.nearestAirportKm,
      stars: profile?.stars,
      twoFAEnabled: profile?.twoFAEnabled || false,
      isDisabled: profile?.isDisabled || false,
      facilityIds: profile?.facilityIds || [],
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        hotelName: profile.hotelName,
        description: profile.description || '',
        location: profile.location || '',
        additionalEmail: profile.additionalEmail || '',
        mobile: profile.mobile || '',
        additionalMobile: profile.additionalMobile || '',
        nearestAirportName: profile.nearestAirportName || '',
        nearestAirportKm: profile.nearestAirportKm,
        stars: profile.stars,
        twoFAEnabled: profile.twoFAEnabled,
        isDisabled: profile.isDisabled,
        facilityIds: profile.facilityIds || [],
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    // Remove empty strings and convert to proper format
    const updateData: Record<string, unknown> = {};

    if (data.hotelName) updateData.hotelName = data.hotelName;
    if (data.description) updateData.description = data.description;
    if (data.location) updateData.location = data.location;
    if (data.additionalEmail) updateData.additionalEmail = data.additionalEmail;
    if (data.mobile) updateData.mobile = data.mobile;
    if (data.additionalMobile) updateData.additionalMobile = data.additionalMobile;
    if (data.nearestAirportName) updateData.nearestAirportName = data.nearestAirportName;
    if (data.nearestAirportKm !== undefined) updateData.nearestAirportKm = data.nearestAirportKm;
    if (data.stars !== undefined) updateData.stars = data.stars;
    if (data.twoFAEnabled !== undefined) updateData.twoFAEnabled = data.twoFAEnabled;
    if (data.isDisabled !== undefined) updateData.isDisabled = data.isDisabled;
    if (data.facilityIds) updateData.facilityIds = data.facilityIds;

    updateProfileMutation.mutate(updateData);
  };

  const facilityOptions =
    facilities.map(facility => ({
      label: facility.title,
      value: facility.id.toString(),
    })) || [];

  return (
    <Form {...form} key={profile?.id || 'new'}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='hotelName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Hotel Name <span className='text-red-500'> *</span>
              </FormLabel>
              <FormControl>
                <Input placeholder='Enter hotel name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description <span className='text-red-500'> *</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Enter hotel description'
                  className='resize-none'
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Location <span className='text-red-500'> *</span>
              </FormLabel>
              <FormControl>
                <Input placeholder='Enter location' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='mobile'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mobile <span className='text-red-500'> *</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Enter mobile number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='additionalMobile'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Mobile</FormLabel>
                <FormControl>
                  <Input placeholder='Enter additional mobile' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='additionalEmail'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='Enter additional email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='nearestAirportName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nearest Airport Name</FormLabel>
                <FormControl>
                  <Input readOnly placeholder='Enter airport name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='nearestAirportKm'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance (km)</FormLabel>
                <FormControl>
                  <Input
                    readOnly
                    type='number'
                    placeholder='Enter distance in km'
                    value={field.value ?? ''}
                    onChange={e =>
                      field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='stars'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Hotel Stars <span className='text-red-500'> *</span>
              </FormLabel>
              <Select
                onValueChange={value => field.onChange(parseInt(value, 10))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select hotel stars (1-5)' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='1'>1 Star</SelectItem>
                  <SelectItem value='2'>2 Stars</SelectItem>
                  <SelectItem value='3'>3 Stars</SelectItem>
                  <SelectItem value='4'>4 Stars</SelectItem>
                  <SelectItem value='5'>5 Stars</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='facilityIds'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Facilities <span className='text-red-500'> *</span>
              </FormLabel>
              <FormControl>
                <MultiSelect
                  options={facilityOptions}
                  selected={field.value?.map(String) || []}
                  onChange={selected => {
                    field.onChange(selected.map(Number));
                  }}
                  placeholder='Select facilities'
                  disabled={facilitiesLoading}
                />
              </FormControl>
              <FormDescription>Select the facilities available at your hotel.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex items-center space-x-6'>
          <FormField
            control={form.control}
            name='twoFAEnabled'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>Two-Factor Authentication</FormLabel>
                  <FormDescription>Enable 2FA for enhanced security</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* <div className='flex items-center space-x-6'>
          <FormField
            control={form.control}
            name='isDisabled'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>Disable Account</FormLabel>
                  <FormDescription>Disable your account temporarily</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div> */}

        <Button type='submit' disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
