import './globals.css'

export const metadata = {
  title: 'Bookly | Bright Edition',
  description: 'Manage your library easily.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#F1F5F9] text-[#0F172A] font-['Sarabun','Inter',sans-serif] antialiased" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}