import React from 'react'
import { Container as ContainerStyled } from './styles'

export default function Container({
  children,
  ...props
}: {
  children: React.ReactElement | React.ReactElement[]
}) {
  return <ContainerStyled {...props}>{children}</ContainerStyled>
}
