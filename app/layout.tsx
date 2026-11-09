import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Providers } from './providers'

const baloo = localFont({ src: './fonts/baloo-2-latin.woff2', weight: '500 800', variable: '--font-baloo', display: 'swap' })
const nunito = localFont({ src: './fonts/nunito-latin.woff2', weight: '400 800', variable: '--font-nunito', display: 'swap' })

export const metadata: Metadata = {
  title: 'Ilha do Tesouro | Uma aventura para o 2º ano',
  description:
    'Uma busca do tesouro colorida para o 2º ano. Encontre as pistas, junte os pedaços do mapa e descubra o tesouro, com leitura por voz e uma pergunta por vez.',
  applicationName: 'Ilha do Tesouro',
  icons: {
    icon: [{ url: '/treasure-icon.svg', type: 'image/svg+xml' }],
    shortcut: '/treasure-icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#dff6fb' }],
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${baloo.variable} ${nunito.variable} bg-background`}>
      <body className="antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
