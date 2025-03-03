'use client'

import { Button } from "@src/components/ui/button";
import { PasswordInput } from "@src/components/ui/passwordinput";
import { useToast } from "@src/hooks/use-toast";
import { resetPassword } from "@src/utils/authactions";

export default function ResetPasswordForm() {
    const { toast } = useToast();

    function validateConfirm(formData: FormData) {
        const password = formData.get('password') as string;
        const password_confirm = formData.get('password_confirm') as string;
        if (password !== password_confirm) {
          toast({
            title: 'Passwords do not match!',
            variant: 'destructive'
          })
          return false;
        }
        return true
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if (!validateConfirm(formData)) {
          return;
        }
        const success = await resetPassword(formData)
        if (!success) {
            toast({
                title: "We're having trouble resetting your password",
                description: "Please try again later.",
                variant: 'destructive'
            })
        }
    }
    return (
        <form onSubmit={handleSubmit} className='flex flex-col w-full'>
            <PasswordInput className='w-full mb-4' id="password" name="password" placeholder='Password' required />
            <PasswordInput className='w-full mb-4' id="password_confirm" name="password_confirm" type="password" placeholder='Confirm password' required />
            <Button size='lg' variant='default' type='submit'>Set Password</Button>
        </form>
    )
}
