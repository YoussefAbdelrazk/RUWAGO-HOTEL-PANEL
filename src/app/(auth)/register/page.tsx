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
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from '@/components/ui/input-otp';
import { MultiSelect } from '@/components/ui/multi-select';
import { useRegister, useVerifyRegistrationOtp } from '@/hooks/use-auth';
import { useFacilities } from '@/hooks/use-facilities';

import {
  registerSchema,
  verifyRegistrationOtpSchema,
  type RegisterFormData,
  type VerifyRegistrationOtpFormData,
} from '@/lib/schemes/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
export default function RegisterPage() {
  const router = useRouter();

  const registerMutation = useRegister();
  const verifyOtpMutation = useVerifyRegistrationOtp();
  const { data: facilities, isLoading: facilitiesLoading } = useFacilities();
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegisterFormData | null>(null);
  const hasResetOtpForm = useRef(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      hotelName: '',
      description: '',
      location: '',
      email: '',
      additionalEmail: '',
      mobile: '',
      additionalMobile: '',
      password: '',
      passwordConfirm: '',
      facilityIds: [],
    },
  });

  const otpForm = useForm<VerifyRegistrationOtpFormData>({
    resolver: zodResolver(verifyRegistrationOtpSchema),
    defaultValues: {
      email: '',
      otp: '',
      hotelName: '',
      description: '',
      location: '',
      additionalEmail: '',
      mobile: '',
      additionalMobile: '',
      password: '',
      facilityIds: [],
    },
  });

  // Reset OTP form when showing OTP form (only once)
  useEffect(() => {
    if (showOtpForm && registrationData && !hasResetOtpForm.current) {
      otpForm.reset({
        email: registrationData.email,
        // otp: '',
        hotelName: registrationData.hotelName,
        description: registrationData.description,
        location: registrationData.location,
        additionalEmail: registrationData.additionalEmail || '',
        mobile: registrationData.mobile,
        additionalMobile: registrationData.additionalMobile || '',
        password: registrationData.password,
        facilityIds: registrationData.facilityIds,
      });
      hasResetOtpForm.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOtpForm, registrationData]);

  // Reset the flag when going back to registration form
  useEffect(() => {
    if (!showOtpForm) {
      hasResetOtpForm.current = false;
    }
  }, [showOtpForm]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log(data);
      await registerMutation.mutateAsync(data);
      setRegistrationData(data);
      setShowOtpForm(true);
      toast.success('OTP Sent', {
        description:
          'A verification code has been sent to your email. Please verify to complete registration.',
      });
    } catch {
      console.log(registerMutation.error?.message);
      toast.error('Registration Failed', {
        description: registerMutation.error?.message || 'An error occurred during registration',
      });
    }
  };

  const onOtpSubmit = async (data: VerifyRegistrationOtpFormData) => {
    try {
      await verifyOtpMutation.mutateAsync(data);
      toast.success('Registration Successful', {
        description: 'Your account has been created successfully. Welcome!',
      });
      router.push('/login');
    } catch {
      toast.error('Verification Failed', {
        description: verifyOtpMutation.error?.message || 'Invalid OTP code',
      });
    }
  };

  const handleBackToRegister = () => {
    setShowOtpForm(false);
    hasResetOtpForm.current = false;
    otpForm.reset();
  };

  const facilityOptions = facilities
    ? facilities.map(facility => ({
        label: facility.title,
        value: facility.id,
      }))
    : [];

  if (showOtpForm && registrationData) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='w-full max-w-md space-y-6 rounded-lg border p-6 shadow-lg'>
          <div className='space-y-2 text-center'>
            <h1 className='text-3xl font-bold'>Verify Registration</h1>
            <p className='text-muted-foreground'>
              Enter the 6-digit code sent to {registrationData.email}
            </p>
          </div>

          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className='space-y-4'>
              {/* <FormField
                control={otpForm.control}
                name='otp'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <div>
                <FormField
                  control={otpForm.control}
                  name='otp'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP Code</FormLabel>
                      <FormControl>
                      <Input {...field} maxLength={6} placeholder='123456' type='text' className='text-center text-2xl tracking-widest' onChange={e => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  className='flex-1'
                  onClick={handleBackToRegister}
                  disabled={verifyOtpMutation.isPending}
                >
                  Back
                </Button>
                <Button type='submit' className='flex-1' disabled={verifyOtpMutation.isPending}>
                  {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <div className='w-full max-w-2xl space-y-6 rounded-lg border p-6 shadow-lg'>
        <div className='space-y-2 text-center'>
          <h1 className='text-3xl font-bold'>Register</h1>
          <p className='text-muted-foreground'>Create your hotel account to get started</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='hotelName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Grand Hotel' {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='A luxurious 5-star hotel in the heart of the city'
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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder='123 Main Street, City, Country' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='info@grandhotel.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='additionalEmail'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='reservations@grandhotel.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='mobile'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input placeholder='+1234567890' {...field} />
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
                    <FormLabel>Additional Mobile (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder='+1234567891' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='SecurePass123!' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='passwordConfirm'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='SecurePass123!' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='facilityIds'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facilities</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={facilityOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder={
                        facilitiesLoading ? 'Loading facilities...' : 'Select facilities'
                      }
                    />
                  </FormControl>
                  <FormDescription>Select at least one facility for your hotel</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* login button */}
            <div className='flex items-center justify-start gap-2'>
              <p className='text-sm text-muted-foreground'>Already have an account?</p>
              <Button
                type='button'
                variant='link'
                className='w-fit'
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={registerMutation.isPending || facilitiesLoading}
            >
              {registerMutation.isPending ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
