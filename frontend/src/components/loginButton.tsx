import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAuth, UserAuthType } from "../context/UserContext";

const onSuccess = async (
	credentialResponse: CredentialResponse,
	userAuth: UserAuthType
) => {
	try {
		userAuth.login(credentialResponse.credential);
	} catch (e) {
		console.log("Verifying Login Failed");
		console.log(e);
	}
};

// Login button for Google OAuth
function LoginButton() {
	const userAuth = useAuth();
	// Another annoying type error for react-oauth...
	const GoogleLoginAny = GoogleLogin as any;
	return (
		<GoogleLoginAny
			hosted_domain="swarthmore.edu"
			onSuccess={(cr: CredentialResponse) => onSuccess(cr, userAuth)}
			onError={() => {
				console.log("Google Login Failed");
			}}
			size={"medium"}
			text={"signin"}
		/>
	);
}

export default LoginButton;
