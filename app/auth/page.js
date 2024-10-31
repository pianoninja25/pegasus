import LoginPage from "./login/page"



const Auth = ({ searchParams }) => {
  const { error, callbackUrl } = searchParams
  return (
    <LoginPage 
      error={error}
      callbackUrl={callbackUrl}
    />
  )
}

export default Auth