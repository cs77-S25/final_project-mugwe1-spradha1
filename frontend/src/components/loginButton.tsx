import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAuth, UserAuthType } from "@/context/UserContext";
import { cn } from "@/lib/utils";

interface LoginButtonProps {
  variant?: 'navbar' | 'home';
  className?: string;
}

const onSuccess = async (
  credentialResponse: CredentialResponse,
  userAuth: UserAuthType
) => {
  try {
    await userAuth.login(credentialResponse.credential);
  } catch (e) {
    console.error("Verifying Login Failed", e);
  }
};

function LoginButton({ variant = 'navbar', className }: LoginButtonProps) {
  const userAuth = useAuth();
  const GoogleLoginAny = GoogleLogin as any;

  if (variant === 'home') {
    return (
      <GoogleLoginAny
        hosted_domain="swarthmore.edu"
        onSuccess={(cr: CredentialResponse) => onSuccess(cr, userAuth)}
        onError={() => console.error("Google Login Failed")}
        size="large"
        text="signin_with"
        shape="rectangular"
        theme="filled_blue"
        width={250}
        className={cn(
          "inline-flex items-center justify-center",
          className
        )}
      />
    );
  }

  // Default navbar style
  return (
    <GoogleLoginAny
      hosted_domain="swarthmore.edu"
      onSuccess={(cr: CredentialResponse) => onSuccess(cr, userAuth)}
      onError={() => console.error("Google Login Failed")}
      size="medium"
      text="signin"
      className={className}
    />
  );
}

export default LoginButton;