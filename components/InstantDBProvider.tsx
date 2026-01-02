'use client'

import { ReactNode } from 'react'

/**
 * InstantDBProvider Component
 * 
 * Note: Instant DB React provides auth and data context automatically through
 * the db instance created via init() in lib/instantdb.ts
 * 
 * This provider component serves as a wrapper for potential future middleware
 * or error boundaries. The actual Instant DB context is available through:
 * - useAuth() hook for authentication state
 * - db.useQuery() for reactive data queries
 * - db.transact() for database mutations
 */
export function InstantDBProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

