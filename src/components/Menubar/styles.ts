import { styled } from '@ignite-ui/react'
import { Card } from '@mui/material'

export const Container = styled(Card, {
  backgroundColor: '#fff',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$4',

  '> div': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '$4',

    'a + a': {
      borderTop: '1px solid $gray100',
      paddingTop: '$4',
    },
  },

  a: {
    '&:hover': {
      opacity: 0.7,
    },
  },
})
