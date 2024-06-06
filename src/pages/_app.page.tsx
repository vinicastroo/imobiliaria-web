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
import { GoogleAnalytics } from '@next/third-parties/google' 
import CookieConsent from 'react-cookie-consent'
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
          <GoogleAnalytics gaId="G-EBJQ0S2YY6" />

          <CookieConsent
              location="bottom"
              buttonText="Aceitar"
              cookieName="auros-cookie-consent"
              style={{ background: "#333" }}
              buttonStyle={{ color: "#fff",background: "#17375F" , fontSize: "14px" }}
              expires={150}
            >
            Este site utiliza cookies para melhorar a experiência do usuário.{" "}
            </CookieConsent>
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  )
}
