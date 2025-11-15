import "../globals.css"
import { Poppins } from 'next/font/google'
import Navbar from "../../components/Navbar"
import { Footer } from '../../components/Layout' // Import the client components
import SessionWrapper from "../SessionWrapper"
import { Toaster } from 'sonner'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'] // Add the weights you need
})

export const metadata = {
  title: 'FindAm - Find Trusted Service Providers',
  description: 'Connect with trusted service providers near you',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
      <SessionWrapper>
        <Navbar />
        {children}
         <Toaster position="top-right" richColors />
        <Footer />
        </SessionWrapper>
      </body>
    </html>
  )
}