import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return <SignUp routing='path' redirectUrl='onboarding' path='sign-up'/>;
}