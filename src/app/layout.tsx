import './globals.css'
import { Lexend } from 'next/font/google'

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Sprachapp - 3 Wörter',
  description: 'Eine App zum Lernen von Sätzen mit 3 Wörtern',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={lexend.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
