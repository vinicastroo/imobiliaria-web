import createEmotionCache from '@/createEmotionCache'
import { getCssText } from '@ignite-ui/react'
import Document, {
  DocumentContext,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import { AppType } from 'next/app'
import { MyAppProps } from './_app.page'

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: JSX.Element[]
}

export default function MyDocument({ emotionStyleTags }: MyDocumentProps) {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta
          name="description"
          content="Descubra uma variedade de imóveis em Rio do Sul e Balneário Camboriú com a Auros Corretora Imobiliária. Desde apartamentos compactos até propriedades de luxo, encontre a casa dos seus sonhos."
        />
        <meta
          name="keywords"
          content="corretora imobiliária, imóveis, Rio do Sul, Imobiliária em Rio do Sul, Balneário Camboriú, Imobiliária em Balneário Camboriú, compra de imóveis, venda de imóveis, mercado imobiliário"
        />
        <meta name="author" content="Auros Corretora Imobiliária" />
        <meta
          property="og:title"
          content="Auros Corretora Imobiliária - Sua Escolha Confiável para Imóveis"
        />
        <meta
          property="og:description"
          content="Explorando uma ampla gama de imóveis para todos os gostos e orçamentos em Rio do Sul e Balneário Camboriú. Visite nosso site para mais informações."
        />

        <meta property="og:url" content="https://aurosimobiliaria.com.br" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta name="emotion-insertion-point" content="" />
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
        {emotionStyleTags}
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage

  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (
        App: React.ComponentType<React.ComponentProps<AppType> & MyAppProps>,
      ) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />
        },
    })

  const initialProps = await Document.getInitialProps(ctx)
  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emotionStyleTags = emotionStyles.styles.map((style: any) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    emotionStyleTags,
  }
}
