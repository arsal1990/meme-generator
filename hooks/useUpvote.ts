import { useState, useEffect } from 'react'
import { db, id } from '@/lib/instantdb'

export function useUpvote(memeId: string, initialUpvoteCount: number, userUpvoteId: string | null) {
  const { user } = db.useAuth()
  const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount)
  const [hasUpvoted, setHasUpvoted] = useState(!!userUpvoteId)
  const [loading, setLoading] = useState(false)

  // Update state when props change (from real-time updates)
  useEffect(() => {
    setUpvoteCount(initialUpvoteCount)
  }, [initialUpvoteCount])

  useEffect(() => {
    setHasUpvoted(!!userUpvoteId)
  }, [userUpvoteId])

  const toggleUpvote = async () => {
    if (!user) {
      alert('Please log in to upvote memes.')
      return
    }

    setLoading(true)
    
    // Optimistic update
    const previousCount = upvoteCount
    const previousHasUpvoted = hasUpvoted
    
    if (hasUpvoted) {
      setUpvoteCount((prev) => Math.max(0, prev - 1))
      setHasUpvoted(false)
    } else {
      setUpvoteCount((prev) => prev + 1)
      setHasUpvoted(true)
    }
    
    try {
      if (previousHasUpvoted && userUpvoteId) {
        // Remove upvote - single transaction
        await db.transact([
          db.tx.upvotes[userUpvoteId].delete(),
          db.tx.memes[memeId].update({
            upvoteCount: Math.max(0, previousCount - 1),
          })
        ])
      } else {
        // Add upvote - single transaction
        const upvoteId = id()
        await db.transact([
          db.tx.upvotes[upvoteId].update({
            memeId,
            userId: user.id,
          }),
          db.tx.memes[memeId].update({
            upvoteCount: previousCount + 1,
          })
        ])
      }
    } catch (error) {
      console.error('Error toggling upvote:', error)
      // Revert optimistic update on error
      setUpvoteCount(previousCount)
      setHasUpvoted(previousHasUpvoted)
      alert('Failed to update upvote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return { upvoteCount, hasUpvoted, toggleUpvote, loading }
}

