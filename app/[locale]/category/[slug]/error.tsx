'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-24 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">حدث خطأ ما</h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
        >
          إعادة المحاولة
        </button>
        <Link
          href="/shop"
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
        >
          العودة للمتجر
        </Link>
      </div>
    </main>
  );
}