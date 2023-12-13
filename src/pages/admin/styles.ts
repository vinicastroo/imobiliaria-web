import { styled } from '@ignite-ui/react'

import Link from 'next/link'

export const LinkStyled = styled(Link, {
  textDecoration: 'none',
})

export const Content = styled('div', {
  width: '100%',
  padding: '$10',
  overflowY: 'auto',
})
