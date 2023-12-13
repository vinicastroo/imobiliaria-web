import { globalCss } from '@ignite-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    backgroundColor: '$white',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
  },

  'body, input, textarea, button': {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 400,
  },

  '@media(max-width: 1080px)': {
    html: {
      fontSize: '93.75%',
    },
  },

  '@media(max-width: 720px)': {
    html: {
      fontSize: '87.5%',
    },
  },
})
