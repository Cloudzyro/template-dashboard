import { Link } from "react-router";
import { buttonClass } from "../components/Card";
import { useTitle } from "../lib/useTitle";

export function NotFound() {
  useTitle("Page not found");
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <p className="num text-6xl font-semibold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-muted">The link may be out of date, or the item may have been removed.</p>
      <Link to="/" className={`${buttonClass.primary} mt-8`}>
        Back to overview
      </Link>
    </div>
  );
}
