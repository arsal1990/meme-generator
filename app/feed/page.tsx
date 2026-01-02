'use client'

import { db } from '@/lib/instantdb'
import { Navbar } from '@/components/Navbar'
import { MemeCard } from '@/components/MemeCard'

export default function FeedPage() {
  const { user } = db.useAuth()
  const { data, isLoading, error } = db.useQuery({
    memes: {
      $: {
        order: {
          serverCreatedAt: 'desc',
        },
      },
    },
    upvotes: user
      ? {
          $: {
            where: {
              userId: user.id,
            },
          },
        }
      : {},
  })

  // Debug logging
  console.log('Feed Page Debug:', {
    isLoading,
    error,
    dataExists: !!data,
    memesCount: data?.memes?.length || 0,
    memes: data?.memes,
    upvotesCount: data?.upvotes?.length || 0,
  })

  // Create a map of user's upvotes for quick lookup
  const userUpvotes = new Map<string, string>()
  if (user && data?.upvotes) {
    data.upvotes.forEach((upvote) => {
      userUpvotes.set(upvote.memeId, upvote.id)
    })
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error loading memes</p>
            <p>{error.message || JSON.stringify(error)}</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-white">
            <p className="text-xl">Loading memes...</p>
          </div>
        </div>
      </div>
    )
  }

  const memes = data?.memes || []

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <header className="text-center text-white mb-8">
          <h1 className="text-5xl font-extrabold mb-2 drop-shadow-lg">📱 Meme Feed</h1>
          <p className="text-xl opacity-90">Discover and upvote the best memes!</p>
        </header>

        {memes.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <p className="text-2xl text-gray-600 mb-4">No memes yet!</p>
            <p className="text-gray-500">Be the first to create and share a meme.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <MemeCard
                key={meme.id}
                meme={meme}
                userUpvoteId={userUpvotes.get(meme.id) || null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

