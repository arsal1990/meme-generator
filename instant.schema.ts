import { i } from '@instantdb/react'

// Instant DB Schema Definition
// This defines the structure of your database entities
// Run `npx instant-cli@latest push schema` to apply changes

const schema = i.schema({
  entities: {
    // Memes entity - stores all created memes
    memes: i.entity({
      imageData: i.string(), // Base64 encoded image
      topText: i.string(),    // Top meme text
      bottomText: i.string(), // Bottom meme text
      createdAt: i.number(),  // Unix timestamp in milliseconds
      userId: i.string(),     // Reference to user who created it
      upvoteCount: i.number(), // Total number of upvotes
    }),

    // Upvotes entity - tracks which users upvoted which memes
    upvotes: i.entity({
      memeId: i.string(),  // Reference to meme ID
      userId: i.string(),  // Reference to user who upvoted
    }),
  },
  
  // Define relationships and constraints
  links: {
    // One meme can have many upvotes
    memesUpvotes: {
      forward: {
        on: 'memes',
        has: 'many',
        label: 'upvotes',
      },
      reverse: {
        on: 'upvotes',
        has: 'one',
        label: 'meme',
      },
    },
  },
})

// Type definitions for TypeScript
export type Schema = typeof schema
export default schema

