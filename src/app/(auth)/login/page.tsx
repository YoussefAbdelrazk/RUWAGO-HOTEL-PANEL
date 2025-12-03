'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useLogin, useVerifyOtp } from '@/hooks/use-auth';
import {
  loginSchema,
  verifyOtpSchema,
  type LoginFormData,
  type VerifyOtpFormData,
} from '@/lib/schemes/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const verifyOtpMutation = useVerifyOtp();
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [email, setEmail] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const otpForm = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: '',
      otp: '',
    },
  });

  // Countdown timer effect
  useEffect(() => {
    if (cooldownSeconds && cooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setCooldownSeconds(prev => (prev && prev > 0 ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      if (response.data?.requiresOtp) {
        setRequiresOtp(true);
        setEmail(response.data.email || data.email);
        setCooldownSeconds(response.data.cooldownSeconds || null);
        otpForm.setValue('email', response.data.email || data.email);
        toast.success('OTP Sent', {
          description:
            response.message || 'OTP sent to your email. Please verify to complete login.',
        });
      } else {
        toast.success('Login Successful', {
          description: 'You have been logged in successfully.',
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred during login';
      toast.error('Login Failed', {
        description: errorMessage,
      });
    }
  };

  const onOtpSubmit = async (data: VerifyOtpFormData) => {
    try {
      // Ensure OTP is exactly 6 digits
      if (!data.otp || data.otp.length !== 6) {
        toast.error('Invalid OTP', {
          description: 'Please enter a 6-digit code',
        });
        return;
      }
      await verifyOtpMutation.mutateAsync(data);
      toast.success('OTP Verified', {
        description: 'Login successful!',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid OTP code';
      toast.error('Verification Failed', {
        description: errorMessage,
      });
    }
  };

  const handleBackToLogin = () => {
    setRequiresOtp(false);
    setCooldownSeconds(null);
    otpForm.reset();
  };

  if (requiresOtp) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='w-full max-w-md space-y-6 rounded-lg border p-6 shadow-lg'>
          <div className='flex justify-center'>
            <Image
              src='/images/logo.JPG'
              alt='Logo'
              width={120}
              height={120}
              className='object-contain'
            />
          </div>
          <div className='space-y-2 text-center'>
            <h1 className='text-3xl font-bold'>Verify OTP</h1>
            <p className='text-muted-foreground'>Enter the 6-digit code sent to {email}</p>
          </div>

          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className='space-y-4'>
              <div className='flex justify-center'>
                <FormField
                  control={otpForm.control}
                  name='otp'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP Code</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                        >
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
                />
              </div>

              {cooldownSeconds !== null && cooldownSeconds > 0 && (
                <div className='rounded-md bg-muted p-3 text-sm text-center'>
                  Resend code available in {cooldownSeconds} seconds
                </div>
              )}

              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  className='flex-1'
                  onClick={handleBackToLogin}
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
      <div className='w-full max-w-md space-y-6 rounded-lg border p-6 shadow-lg'>
        <div className='flex justify-center'>
          <Image
            src='/images/logo.JPG'
            alt='Logo'
            width={120}
            height={120}
            className='object-contain'
          />
        </div>
        <div className='space-y-2 text-center'>
          <h1 className='text-3xl font-bold'>Login</h1>
          <p className='text-muted-foreground'>Enter your credentials to access your account</p>
        </div>

        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className='space-y-4'>
            <FormField
              control={loginForm.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='hotel@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        className='pr-10'
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className='h-4 w-4 text-muted-foreground' />
                        ) : (
                          <EyeIcon className='h-4 w-4 text-muted-foreground' />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-center justify-between gap-2'>
              <p className='text-sm text-muted-foreground'>Forgot your password?</p>
              <Button
                type='button'
                variant='link'
                className='w-fit'
                onClick={() => router.push('/forgot-password')}
              >
                Forgot Password
              </Button>
            </div>

            <Button type='submit' className='w-full' disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
            <div className='flex items-center justify-start gap-2'>
              <p className='text-sm text-muted-foreground'>Don&apos;t have an account?</p>
              <Button
                type='button'
                variant='link'
                className='w-fit'
                onClick={() => router.push('/register')}
              >
                Register
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
