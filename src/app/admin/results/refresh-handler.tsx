'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const REFRESH_INTERVAL = 30000; // 30 seconds

export function RefreshHandler() {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      router.refresh();
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [router]);

  return null;
}