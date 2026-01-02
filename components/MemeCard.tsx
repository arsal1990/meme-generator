'use client'

import { useUpvote } from '@/hooks/useUpvote'
import { db } from '@/lib/instantdb'

interface MemeCardProps {
  meme: {
    id: string
    imageData: string
    topText: string
    bottomText: string
    createdAt: number
    userId: string
    upvoteCount: number
  }
  userUpvoteId: string | null
}

export function MemeCard({ meme, userUpvoteId }: MemeCardProps) {
  const { user } = db.useAuth()
  const { upvoteCount, hasUpvoted, toggleUpvote, loading } = useUpvote(
    meme.id,
    meme.upvoteCount,
    userUpvoteId
  )

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={meme.imageData}
          alt="Meme"
          className="w-full h-auto"
          style={{
            backgroundImage: `url(${meme.imageData})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {meme.topText && (
          <div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center px-4"
            style={{
              textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: 'bold',
              fontFamily: 'Impact, Arial Black, sans-serif',
            }}
          >
            {meme.topText}
          </div>
        )}
        {meme.bottomText && (
          <div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center px-4"
            style={{
              textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: 'bold',
              fontFamily: 'Impact, Arial Black, sans-serif',
            }}
          >
            {meme.bottomText}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{formatDate(meme.createdAt)}</span>
          <button
            onClick={toggleUpvote}
            disabled={loading || !user}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              hasUpvoted
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={!user ? 'Log in to upvote' : hasUpvoted ? 'Remove upvote' : 'Upvote'}
          >
            <span className="text-xl">{hasUpvoted ? '❤️' : '🤍'}</span>
            <span className="font-semibold">{upvoteCount}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

