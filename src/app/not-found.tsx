export default function NotFound() {
  return (
    <div data-header-text="light" className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-primary">404</h1>
        <p className="mt-4 text-gray-600">
          The requested page does not exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded bg-primary px-6 py-3 text-white"
        >
          Return Home
        </a>
      </div>
    </div>
  );
} 
