import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DiveMix - Gas & Compressor Technologies',
  description: 'Leading the industry in compressed air and gas solutions since 1990',
  icons: {
    icon: '/img/faveicon.ico',
  },
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