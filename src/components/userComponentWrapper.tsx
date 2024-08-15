import { currentUser } from "@clerk/nextjs/server";
import { Separator } from "~/components/ui/separator";
import { Hurricane } from "next/font/google";

const titleFont = Hurricane({
  weight: "400",
  subsets: ["latin"],
});

export async function UserComponentWrapper({
  children,
}: React.PropsWithChildren) {
  const user = await currentUser();
  if (!user) {
    throw "Unauthorized";
  }
  return (
    <div className="flex min-h-screen flex-col gap-3 pb-4 pt-16">
      <span
        className={`text-center text-6xl ${titleFont.className}`}
      >
        Hey {user.firstName}
      </span>
      <span className="text-center text-xl italic">
        Let&apos;s make your day!
      </span>
      <Separator className="mt-4 bg-slate-500" />
      {children}
    </div>
  );
}
