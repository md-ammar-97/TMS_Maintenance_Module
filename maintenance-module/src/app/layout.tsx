import type { Metadata } from 'next'
import { AppProvider } from '@/context/AppContext'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Maintenance Module — FreightNXT',
  description: 'TMS Maintenance Module Prototype',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <AppProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </AppProvider>
      </body>
    </html>
  )
}
