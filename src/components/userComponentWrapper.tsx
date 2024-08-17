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
    return (
      <div className="flex min-h-screen flex-col gap-2 py-4">
        <span className={`text-center text-5xl ${titleFont.className}`}>
          Welcome!
        </span>
        <span className="text-center text-lg italic">
          Let&apos;s make your day!
        </span>
        <Separator className="mt-4 bg-primary" />
        {children}
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col gap-2 py-4">
      <span className={`text-center text-5xl ${titleFont.className}`}>
        Hey {user.firstName}
      </span>
      <span className="text-center text-lg italic">
        Let&apos;s make your day!
      </span>
      <Separator className="mt-4 bg-primary" />
      {children}
    </div>
  );
}
