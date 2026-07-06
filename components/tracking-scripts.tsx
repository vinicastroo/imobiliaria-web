import Script from 'next/script'
import { getTenantVisualConfig } from '@/lib/visual-config'

const META_PIXEL_ID_PATTERN = /^\d{5,20}$/
const GTM_ID_PATTERN = /^GTM-[A-Z0-9]{4,10}$/

/**
 * Injects the tenant's third-party tracking scripts (Meta Pixel and Google
 * Tag Manager) configured in /admin/configuracoes. Render inside public site
 * layouts only — never in the admin panel, to keep analytics clean.
 * IDs are validated by the API, and re-checked here before interpolation.
 */
export async function TrackingScripts() {
  const { metaPixelId, gtmId } = await getTenantVisualConfig()

  const safePixelId = metaPixelId && META_PIXEL_ID_PATTERN.test(metaPixelId) ? metaPixelId : null
  const safeGtmId = gtmId && GTM_ID_PATTERN.test(gtmId) ? gtmId : null

  if (!safePixelId && !safeGtmId) return null

  return (
    <>
      {safeGtmId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${safeGtmId}');
          `}
        </Script>
      )}
      {safePixelId && (
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${safePixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
      {safeGtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${safeGtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}
    </>
  )
}
