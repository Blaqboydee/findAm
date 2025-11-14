import "./globals.css"
import { Poppins } from 'next/font/google'
import { Navbar, Footer } from '../components/Layout' // Import the client components
import SessionWrapper from "./SessionWrapper"

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'] // Add the weights you need
})

export const metadata = {
  title: 'FindAm - Find Trusted Service Providers',
  description: 'Connect with trusted service providers near you',
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent"
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1E40AF" />
      </head>
      <body className={poppins.className}>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  )
}