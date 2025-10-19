'use client'

import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { useToast } from "@src/hooks/use-toast";
import { sendResetPasswordEmail } from "@src/utils/authactions";
import { Alert, AlertDescription } from '@src/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ForgotPasswordForm() {
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
        }
    }, [searchParams]);

    function validateEmail(formData: FormData) {
        // TODO: extra validation logic
        return true
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        const formData = new FormData(event.currentTarget);
        if (!validateEmail(formData)) {
          return;
        }
        const result = await sendResetPasswordEmail(formData)
        if (result.success) {
          toast({
            title: 'Password reset email sent!',
            description: 'Check your email for the reset link.',
            variant: 'success'
          })
        } else {
          toast({
            title: "Unable to send reset email",
            description: result.message || "Please try again later.",
            variant: 'destructive'
          })
        }
    }
    return (
        <>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <div className='flex items-center gap-3'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </div>
                </Alert>
            )}
            <form onSubmit={handleSubmit} className='flex flex-col w-full'>
                <Input className='w-full mb-4' id="email" name="email" type="email" placeholder='Email' required />
                <Button size='lg' variant='default' type='submit' formAction={''}>Send Password Reset</Button>
            </form>
        </>
    )
}
