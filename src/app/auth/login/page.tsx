import Auth from '@src/components/auth';

export const metadata = {
  title: "Log In | VALVOD",
  description: "Log in to VALVOD to access your library and more.",
}

export default function Login() {
  return (
    <Auth page={"Login"}/>
  )
}
