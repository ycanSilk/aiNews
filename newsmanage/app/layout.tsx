import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News Management System',
  description: 'AI News Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}