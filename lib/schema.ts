// Instant DB schemas are defined in the Instant DB dashboard
// This file documents the schema structure for reference
// 
// IMPORTANT: Configure these schemas in the Instant DB dashboard
// See INSTANTDB_SCHEMA_SETUP.md for detailed configuration instructions
//
// Schema structure:
// 
// Entity: memes
// - id: string (auto-generated)
// - imageData: string (base64 encoded image)
// - topText: string
// - bottomText: string
// - createdAt: number (timestamp in milliseconds)
// - userId: string (reference to auth user)
// - upvoteCount: number (default: 0)
//
// Entity: upvotes
// - id: string (auto-generated)
// - memeId: string (reference to memes.id)
// - userId: string (reference to auth user)
// - Unique constraint: (memeId, userId)

export type Meme = {
  id: string
  imageData: string
  topText: string
  bottomText: string
  createdAt: number
  userId: string
  upvoteCount: number
}

export type Upvote = {
  id: string
  memeId: string
  userId: string
}

