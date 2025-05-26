import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">Could not find the requested page</p>
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
