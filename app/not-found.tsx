import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="section">
        <div className="container max-w-2xl text-center">
          <p className="eyebrow mb-4">Error 404</p>
          <h1>We could not find that page</h1>
          <p className="lede mt-6">The page may have moved, or the address may be mistyped.</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-primary">Go to the home page</Link>
            <Link href="/services" className="btn-secondary">View services</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
