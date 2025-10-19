'use client'

import { Button } from "@src/components/ui/button";
import { PasswordInput } from "@src/components/ui/passwordinput";
import { resetPassword } from "@src/utils/authactions";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from '@src/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function ResetPasswordForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    function validateConfirm(formData: FormData) {
        const password = formData.get('password') as string;
        const password_confirm = formData.get('password_confirm') as string;
        if (password !== password_confirm) {
          setError('Passwords do not match!');
          return false;
        }
        return true
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        const formData = new FormData(event.currentTarget);
        if (!validateConfirm(formData)) {
          return;
        }
        const result = await resetPassword(formData)
        if (result.success) {
            router.push('/auth/login')
            router.refresh()
        } else {
            setError(result.message || "Unable to reset password. Please try again later.")
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
                <PasswordInput className='w-full mb-4' id="password" name="password" placeholder='Password' required />
                <PasswordInput className='w-full mb-4' id="password_confirm" name="password_confirm" type="password" placeholder='Confirm password' required />
                <Button size='lg' variant='default' type='submit'>Set Password</Button>
            </form>
        </>
    )
}
