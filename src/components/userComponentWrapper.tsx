import { Separator } from '~/components/ui/separator';

export function UserComponentWrapper({ children }: React.PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col gap-2 py-4">
      <span className="text-center text-2xl font-semibold">Hey Oliver</span>
      <span className="text-center text-xl italic">Let's make your day!</span>
      <Separator className="bg-slate-500 mt-4" />
      {children}
    </div>
  );
}
