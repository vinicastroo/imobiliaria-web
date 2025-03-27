import { globalStyles } from '@/styles/global'
import type { AppProps } from 'next/app'
import CssBaseline from '@mui/material/CssBaseline'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CacheProvider, EmotionCache } from '@emotion/react'
import Head from 'next/head'
import createEmotionCache from '@/createEmotionCache'
import { QueryClientProvider } from '@tanstack/react-query'
import { query } from '@/lib/react-query'
import Script from 'next/script'
import { GoogleTagManager } from '@next/third-parties/google'

const theme = createTheme({
  palette: {
    primary: {
      main: '#17375F',
    },
    secondary: {
      main: '#DEBD02',
    },
  },
  typography: {
    fontFamily: `"Montserrat", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
})

globalStyles()

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}
export default function App(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { session, ...pageProps },
  } = props

  return (
    <SessionProvider session={session}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <QueryClientProvider client={query}>
            <Component {...pageProps} />
          </QueryClientProvider>
          <ToastContainer autoClose={2000} />

          <GoogleTagManager gtmId="AW-16855847377" />

          <Script id="facebook-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
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

          {/* <CookieConsent
              location="bottom"
              buttonText="Aceitar"
              cookieName="auros-cookie-consent"
              style={{ background: "#333" }}
              buttonStyle={{ color: "#fff",background: "#17375F" , fontSize: "14px" }}
              expires={150}
            >
            Este site utiliza cookies para melhorar a experiência do usuário.{" "}
            </CookieConsent> */}
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  )
}
