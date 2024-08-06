import { Separator } from '~/components/ui/separator';
import { Hurricane } from 'next/font/google';

const titleFont = Hurricane({
  weight: "400",
  subsets: ["latin"]
})

export function UserComponentWrapper({ children }: React.PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col gap-3 pt-16 pb-4">
      <span className={`text-center text-6xl font-semibold ${titleFont.className}`}>Hey Oliver</span>
      <span className="text-center text-xl italic">Let&apos;s make your day!</span>
      <Separator className="bg-slate-500 mt-4" />
      {children}
    </div>
  );
}
