"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import UserMenu from "./user-menu";

export default function HeaderAuth() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <UserMenu />;
  }

  return (
    <SignInButton forceRedirectUrl="/onboarding">
      <Button variant="outline">Login</Button>
    </SignInButton>
  );
}
