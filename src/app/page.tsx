import { Button } from "~/components/ui/button";
import { ArrowBigRightIcon } from "lucide-react";
import { Hurricane } from "next/font/google";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import clsx from "clsx";

const titleFont = Hurricane({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1
        className={clsx(
          "text-6xl font-bold capitalize text-primary",
          titleFont.className,
        )}
      >
        Make My Day
      </h1>
      <span className="text-lg">
        Your personalized, AI-crafted, daily
        <br />
        adventures in Mauritius.
      </span>
      <SignedOut>
        <Button
          size="lg"
          asChild
          className="mt-6 w-full text-lg uppercase"
        >
          <SignInButton>Sign In</SignInButton>
        </Button>
      </SignedOut>

      <SignedIn>
        <Button size="lg" asChild className="mt-6 w-full">
          <Link href="/start">
            <span className="text-lg uppercase">Get Started</span>
            <ArrowBigRightIcon className="h-6 w-6" />
          </Link>
        </Button>
      </SignedIn>
    </div>
  );
}
