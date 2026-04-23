import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-cyan-700 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/en"
          className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white font-medium rounded-md hover:bg-cyan-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
