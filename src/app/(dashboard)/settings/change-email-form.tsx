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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useChangeEmailInitiate, useVerifyEmailChange } from '@/hooks/use-profile';
import {
  changeEmailInitiateSchema,
  verifyEmailChangeSchema,
  type ChangeEmailInitiateFormData,
  type VerifyEmailChangeFormData,
} from '@/lib/schemes/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ChangeEmailFormProps {
  currentEmail?: string;
}

export function ChangeEmailForm({ currentEmail }: ChangeEmailFormProps) {
  const initiateMutation = useChangeEmailInitiate();
  const verifyMutation = useVerifyEmailChange();
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const initiateForm = useForm<ChangeEmailInitiateFormData>({
    resolver: zodResolver(changeEmailInitiateSchema),
    defaultValues: {
      newEmail: '',
    },
  });

  const otpForm = useForm<VerifyEmailChangeFormData>({
    resolver: zodResolver(verifyEmailChangeSchema),
    defaultValues: {
      newEmail: '',
      otp: '',
    },
  });

  const onInitiateSubmit = async (data: ChangeEmailInitiateFormData) => {
    try {
      await initiateMutation.mutateAsync(data);
      setNewEmail(data.newEmail);
      setShowOtpForm(true);
      otpForm.reset({
        newEmail: data.newEmail,
        otp: '',
      });
    } catch {
      // Error is handled by the hook's onError
    }
  };

  const onVerifySubmit = async (data: VerifyEmailChangeFormData) => {
    try {
      await verifyMutation.mutateAsync(data);
      setShowOtpForm(false);
      initiateForm.reset();
      otpForm.reset();
      setNewEmail('');
    } catch {
      // Error is handled by the hook's onError
    }
  };

  const handleBack = () => {
    setShowOtpForm(false);
    otpForm.reset();
  };

  if (showOtpForm) {
    return (
      <div className='space-y-6'>
        <div>
          <p className='text-sm text-muted-foreground'>
            We&apos;ve sent a verification code to <strong>{newEmail}</strong>. Please enter the code
            below to verify your new email address.
          </p>
        </div>

        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onVerifySubmit)} className='space-y-6'>
            <FormField
              control={otpForm.control}
              name='otp'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
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
                  <FormDescription>Enter the 6-digit code sent to your new email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-4'>
              <Button type='button' variant='outline' onClick={handleBack}>
                Back
              </Button>
              <Button type='submit' disabled={verifyMutation.isPending}>
                {verifyMutation.isPending ? 'Verifying...' : 'Verify Email'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <Form {...initiateForm}>
      <form onSubmit={initiateForm.handleSubmit(onInitiateSubmit)} className='space-y-6'>
        <div>
          <p className='text-sm text-muted-foreground mb-4'>
            Current email: <strong>{currentEmail || 'Not available'}</strong>
          </p>
        </div>

        <FormField
          control={initiateForm.control}
          name='newEmail'
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Email Address</FormLabel>
              <FormControl>
                <Input type='email' placeholder='Enter new email address' {...field} />
              </FormControl>
              <FormDescription>
                You&apos;ll receive a verification code at this email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={initiateMutation.isPending}>
          {initiateMutation.isPending ? 'Sending...' : 'Send Verification Code'}
        </Button>
      </form>
    </Form>
  );
}
