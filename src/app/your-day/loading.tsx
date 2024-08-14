import { Loader2Icon } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 justify-center items-center">
    <Loader2Icon className='h-8 w-8 animate-spin' />
    <span>Making your day...</span>
  </div>

  )
}