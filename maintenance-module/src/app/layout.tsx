import type { Metadata } from 'next'
import { AppProvider } from '@/context/AppContext'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Maintenance Module — FreightNXT',
  description: 'TMS Maintenance Module Prototype',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full dark">
      <body className="h-full">
        <ThemeProvider>
          <AppProvider>
            {children}
            <Toaster position="bottom-right" richColors theme="system" />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
