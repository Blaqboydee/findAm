import "./globals.css"
import { Poppins } from 'next/font/google'
import { Navbar, Footer } from '../components/Layout' // Import the client components

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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}