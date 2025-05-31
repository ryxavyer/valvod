import Auth from '@src/components/auth';

export const metadata = {
  title: "Sign Up | VALVOD",
  description: "Sign up to get access to favorites, tags, and more!."
}

export default function Signup() {
  return (
    <Auth page={"Signup"}/>
  )
}
