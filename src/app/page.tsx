import { Button } from "~/components/ui/button";
import { ChevronRightIcon } from 'lucide-react';
import { Hurricane } from 'next/font/google';
import Link from "next/link";
import clsx from 'clsx';

const titleFont = Hurricane({
  weight: "400",
  subsets: ["latin"]
})

export default function Home() {
  return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className={clsx("text-6xl font-bold capitalize text-primary", titleFont.className)}>
          Make My Day
        </h1>
        <span className="text-lg">
          Your personalized, AI-crafted, daily
          <br />
          adventures in Mauritius.
        </span>

        <Button size="lg" asChild className="w-full max-w-[300px] mt-6 h-12">
          <Link href="/start">
            <span className="text-lg font-semibold uppercase">Get Started</span>
            <ChevronRightIcon className="w-6 h-6" />
          </Link>
        </Button>
      </div>
  );
}
