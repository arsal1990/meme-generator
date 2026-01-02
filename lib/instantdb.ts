import { init, id, tx } from '@instantdb/react'
import schema from '../instant.schema'

const APP_ID = '0116cf54-b16e-4799-b933-c400275436b6'

// Initialize Instant DB with schema
export const db = init({ 
  appId: APP_ID,
  schema,
})

// Export id and tx for convenience
export { id, tx }

