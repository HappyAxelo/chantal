"use client";

import Link from "next/link";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="section">
      <div className="container max-w-2xl text-center">
        <p className="eyebrow mb-4">Something went wrong</p>
        <h1 className="text-4xl">This page could not be displayed</h1>
        <p className="lede mt-6">Please try again. If the problem continues, you can still reach us through the contact page.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn-primary">Try again</button>
          <Link href="/contact" className="btn-secondary">Contact us</Link>
        </div>
      </div>
    </div>
  );
}
