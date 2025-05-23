'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/users');
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">User Management System</h1>
        <p>Redirecting to users page...</p>
      </div>
    </div>
  );
}
