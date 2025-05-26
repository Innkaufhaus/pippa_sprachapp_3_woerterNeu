import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="de">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className="font-['Lexend'] antialiased">
        {children}
      </body>
    </html>
  )
}
