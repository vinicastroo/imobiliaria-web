import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { GoogleTagManager } from '@next/third-parties/google'
import Script from 'next/script'
import { Providers } from "./providers"
import { Toaster } from "components/ui/sonner"
import "./globals.css"

// Configuração da fonte (Substitui os <link> do Google Fonts)
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-montserrat",
  display: 'swap',
})

// Aqui migramos todas as tags <meta> do seu antigo _document
export const metadata: Metadata = {
  title: "Auros Corretora Imobiliária",
  description: "Descubra uma variedade de imóveis em Rio do Sul e Balneário Camboriú com a Auros Corretora Imobiliária. Desde apartamentos compactos até propriedades de luxo, encontre a casa dos seus sonhos.",
  keywords: [
    "corretora imobiliária",
    "imóveis",
    "Rio do Sul",
    "Imobiliária em Rio do Sul",
    "Balneário Camboriú",
    "Imobiliária em Balneário Camboriú",
    "compra de imóveis",
    "venda de imóveis",
    "mercado imobiliário"
  ],
  authors: [{ name: "Auros Corretora Imobiliária" }],

  // Configuração do Open Graph (Facebook/WhatsApp/LinkedIn)
  openGraph: {
    type: "website",
    url: "https://www.aurosimobiliaria.com.br/",
    title: "Auros Corretora Imobiliária",
    description: "Descubra uma variedade de imóveis em Rio do Sul e Balneário Camboriú com a Auros Corretora Imobiliária.",
    // Se você tiver a imagem, adicione aqui:
    // images: [{ url: "https://www.aurosimobiliaria.com.br/og-image.jpg" }],
  },

  // Configuração do Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Auros Corretora Imobiliária",
    description: "Descubra uma variedade de imóveis em Rio do Sul e Balneário Camboriú com a Auros Corretora Imobiliária.",
    images: ["https://www.aurosimobiliaria.com.br/logo.png"], // Peguei do seu código antigo
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${montserrat.className} antialiased`}>
        <Providers session={null}>
          {children}
          <Toaster />
        </Providers>

        <GoogleTagManager gtmId="AW-16855847377" />

        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1081492213995645');
            fbq('track', 'PageView');
          `}
        </Script>
      </body>
    </html>
  )
}