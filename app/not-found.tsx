import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-pink-500 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🤷</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist. Maybe it became a meme?
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-semibold shadow-md hover:shadow-lg"
          >
            Go to Meme Generator
          </Link>
          <Link
            href="/feed"
            className="block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Browse Meme Feed
          </Link>
        </div>
      </div>
    </div>
  )
}

