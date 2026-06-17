"use client";

import { Show, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import UserMenu from "./user-menu";
import { PenBox } from "lucide-react";

export default function Header() {
  return (
    <header className="container mx-auto">
      <nav className="py-8 px-4 flex justify-between items-center">
        <Link href="/">
          <Image
            src="/jexo-logo.png"
            alt="Jexo Logo"
            width={200}
            height={56}
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/project/create">
            <Button size="lg" variant="destructive">
              <PenBox size={20} />
              <span>Create Project</span>
            </Button>
          </Link>

          <Show when="signed-in">
            <>
              <UserMenu />
            </>
          </Show>

          <Show when="signed-out">
            <>
              <SignInButton forceRedirectUrl="/onboarding">
                <Button variant="outline">Login</Button>
              </SignInButton>
            </>
          </Show>
        </div>
      </nav>
    </header>
  );
}
