import { MenuIcon } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <div className="absolute right-0 top-2 px-2 text-right">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <MenuIcon className="h-5 w-5" />
      </SignedOut>
    </div>
  );
}
