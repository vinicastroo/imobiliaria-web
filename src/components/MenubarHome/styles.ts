import { styled } from '@ignite-ui/react'
import { Card } from '@mui/material'

export const Container = styled(Card, {
  backgroundColor: '#FA7E13',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$1 $4',
  borderRadius: 0,

  '> div:first-child': {
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
