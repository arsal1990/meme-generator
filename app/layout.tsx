import type { Metadata } from 'next'
import './globals.css'
import { InstantDBProvider } from '@/components/InstantDBProvider'

export const metadata: Metadata = {
  title: 'Meme Generator',
  description: 'Create hilarious memes and share them with the community!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <InstantDBProvider>{children}</InstantDBProvider>
      </body>
    </html>
  )
}

