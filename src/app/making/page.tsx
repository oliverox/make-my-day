"use client";

import { useEffect } from 'react';
import { Loader2Icon } from 'lucide-react';
import { UserComponentWrapper } from "~/components/userComponentWrapper";
import { useRouter } from 'next/navigation';
export default function MakingPage() {
  const router = useRouter();
  useEffect(() => {
    const date = localStorage.getItem('mmd.selectedDate');
    setTimeout(() => {
      let url = "/your-day?";
      if (date) {
        url = `${url}&date=${date}`; 
      }
      console.log('redirecting to:', url)
      router.push(url);
    }, 1000)
  }, [])
  return (
    <UserComponentWrapper>
      <div className="flex flex-1 flex-col gap-4 justify-center items-center">
        <Loader2Icon className='h-8 w-8 animate-spin' />
        <span>Making your day...</span>
      </div>
    </UserComponentWrapper>
  );
}
