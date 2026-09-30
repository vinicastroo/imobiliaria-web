import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.replayIntegration()],
  // Ruído do scanner de links do Outlook/Microsoft Defender Safe Links
  ignoreErrors: [/Object Not Found Matching Id:\d+, MethodName:\w+, ParamCount:\d+/],
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
