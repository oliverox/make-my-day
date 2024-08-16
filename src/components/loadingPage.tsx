import { Loader2Icon } from "lucide-react";
import { Hurricane } from "next/font/google";
import clsx from "clsx";

const titleFont = Hurricane({
  weight: "400",
  subsets: ["latin"],
});

export function LoadingPage() {
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
      <div className="flex flex-row items-center gap-2">
        <Loader2Icon className="h-6 w-6 animate-spin" />
        <span className="text-lg">Loading...</span>
      </div>
    </div>
  );
}
