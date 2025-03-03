'use client'

import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { useToast } from "@src/hooks/use-toast";
import { sendResetPasswordEmail } from "@src/utils/authactions";

export default function ForgotPasswordForm() {
    const { toast } = useToast();

    function validateEmail(formData: FormData) {
        // TODO: extra validation logic
        return true
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if (!validateEmail(formData)) {
          return;
        }
        const sent = await sendResetPasswordEmail(formData)
        if (sent) {
          toast({
            title: 'Password reset email sent!',
            description: 'Use the link to reset your password.',
            variant: 'success'
          })
        } else {
          toast({
            title: "We're having trouble sending a reset email",
            description: "Please try again later.",
            variant: 'destructive'
          })
        }
    }
    return (
        <form onSubmit={handleSubmit} className='flex flex-col w-full'>
            <Input className='w-full mb-4' id="email" name="email" type="email" placeholder='Email' required />
            <Button size='lg' variant='default' type='submit' formAction={''}>Send Password Reset</Button>
        </form>
    )
}
