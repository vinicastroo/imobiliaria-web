import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import Script from 'next/script'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="pt-BR">
      <body className={`${montserrat.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "Auros Corretora Imobiliária",
              url: "https://aurosimobiliaria.com.br",
              logo: "https://aurosimobiliaria.com.br/logo-full.svg",
              email: "aurosimobiliaria@gmail.com",
              telephone: ["+55-47-99900-8090", "+55-47-98816-3739"],
              address: [
                {
                  "@type": "PostalAddress",
                  streetAddress: "R. XV de Novembro, 1751 - sala 02",
                  addressLocality: "Rio do Sul",
                  addressRegion: "SC",
                  addressCountry: "BR",
                  neighborhood: "Laranjeiras",
                },
                {
                  "@type": "PostalAddress",
                  streetAddress: "Rua 2000, 121, La Belle Tour Résidence - sala 11",
                  addressLocality: "Balneário Camboriú",
                  addressRegion: "SC",
                  addressCountry: "BR",
                  neighborhood: "Centro",
                },
              ],
              sameAs: [
                "https://www.instagram.com/auroscorretoraimobiliaria/",
                "https://www.facebook.com/AurosCorretoraImob",
              ],
            }),
          }}
        />

        <Providers session={session}>
          {children}
          <Toaster />
        </Providers>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-16855847377"
          strategy="lazyOnload"
        />
        <Script id="google-ads" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16855847377');
          `}
        </Script>

        <Script id="facebook-pixel" strategy="lazyOnload">
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