import { SignedIn, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <div className="absolute right-0 top-6 px-4 text-right">
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
