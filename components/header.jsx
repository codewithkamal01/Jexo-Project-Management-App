import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import HeaderAuth from "./header-auth";

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

          <HeaderAuth />
        </div>
      </nav>
    </header>
  );
}
