'use client'

import Link from 'next/link'
import { db } from '@/lib/instantdb'
import { Auth } from './Auth'

export function Navbar() {
  const { user } = db.useAuth()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-primary hover:text-primary-hover">
              🎭 Meme Generator
            </Link>
            <Link
              href="/feed"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Feed
            </Link>
          </div>
          <div className="flex items-center">
            <Auth />
          </div>
        </div>
      </div>
    </nav>
  )
}

