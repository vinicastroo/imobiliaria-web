import { Typography } from '@mui/material'
import { ArrowLeft } from 'phosphor-react'

import { LinkStyled } from './styles'
interface BackLinkProps {
  href?: string
}
export function BackLink({ href = '/' }: BackLinkProps) {
  return (
    <LinkStyled href={href}>
      <Typography variant="caption">
        <ArrowLeft /> Voltar
      </Typography>
    </LinkStyled>
  )
}
