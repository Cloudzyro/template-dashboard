import { Link } from "react-router";
import { buttonClass } from "../components/Card";
import { useTitle } from "../lib/useTitle";

export function NotFound() {
  useTitle("Page not found");
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <p className="num font-mono text-sm text-muted">404</p>
      <h1 className="mt-3 text-[28px] font-medium tracking-[-0.01em]">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-muted">The link may be out of date, or the item may have been removed.</p>
      <Link to="/" className={`${buttonClass.primary} mt-8`}>
        Back to overview
      </Link>
    </div>
  );
}
