import { ClerkProvider } from '@clerk/nextjs'
import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/shared/Navbar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import Bottombar from '@/components/shared/Bottombar'
import RightSidebar from '@/components/shared/RightSidebar'
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TrickTrove',
  description: 'A Next.js 13 Saketboard Social Application'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme: dark,
    }}>
      <html lang="en">
        <body className={inter.className}>
         <Navbar />
         
        <main>
          <section className='main-container'>
            <div className='w-full max-w-4xl'>
          {children}
            </div>
          </section>
          <LeftSidebar />
          

          <RightSidebar />
          </main> 
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  )
}