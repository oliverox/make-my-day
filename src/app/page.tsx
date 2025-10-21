import { Button } from "~/components/ui/button";
import { ChevronRightIcon, Calendar, Sparkles, MapPin } from "lucide-react";
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      {/* Hero Section */}
      <div className="flex max-w-3xl flex-col items-center gap-6">
        <h1
          className={clsx(
            "text-7xl font-bold capitalize text-primary md:text-8xl",
            titleFont.className,
          )}
        >
          Make My Day
        </h1>
        <p className="text-xl text-muted-foreground md:text-2xl">
          Your personalized, AI-crafted, daily adventures
        </p>
      </div>

      {/* Features */}
      <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-6 shadow-sm">
          <Calendar className="h-10 w-10 text-primary" />
          <h3 className="font-semibold">Plan Your Day</h3>
          <p className="text-sm text-muted-foreground">
            Set your budget, group size, and preferences
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-6 shadow-sm">
          <Sparkles className="h-10 w-10 text-primary" />
          <h3 className="font-semibold">AI-Powered</h3>
          <p className="text-sm text-muted-foreground">
            Get personalized recommendations just for you
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-6 shadow-sm">
          <MapPin className="h-10 w-10 text-primary" />
          <h3 className="font-semibold">Discover Activities</h3>
          <p className="text-sm text-muted-foreground">
            Explore amazing experiences in your area
          </p>
        </div>
      </div>

      {/* CTA */}
      <SignedOut>
        <Button
          size="lg"
          asChild
          className="mt-4 w-full max-w-xs text-lg uppercase shadow-lg"
        >
          <SignInButton>Get Started</SignInButton>
        </Button>
      </SignedOut>

      <SignedIn>
        <Button size="lg" asChild className="mt-4 w-full max-w-xs shadow-lg">
          <Link href="/start">
            <span className="text-lg uppercase">Plan Your Day</span>
            <ChevronRightIcon className="h-6 w-6" />
          </Link>
        </Button>
      </SignedIn>
    </div>
  );
}
