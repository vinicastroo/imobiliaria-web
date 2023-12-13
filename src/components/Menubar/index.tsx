import { Container } from './styles'

import logo from '../../assets/logo-auros.svg'
import Image from 'next/image'
import { House, SignOut, Tag } from 'phosphor-react'
import Link from 'next/link'
import { IconButton, Tooltip } from '@mui/material'
import { signOut } from 'next-auth/react'

export function Menubar() {
  return (
    <Container variant="outlined">
      <div>
        <Link href="/admin">
          <Tooltip title="Início">
            <Image src={logo} alt="logo" width={50} height={45} />
          </Tooltip>
        </Link>

        <Link href="/admin/imoveis">
          <Tooltip title="Imóveis">
            <IconButton>
              <House size={25} weight="fill" color="#868e96" />
            </IconButton>
          </Tooltip>
        </Link>
        <Link href="/admin/tipo-imovel">
          <Tooltip title="Tipo imóvel">
            <IconButton>
              <Tag size={25} weight="fill" color="#868e96" />
            </IconButton>
          </Tooltip>
        </Link>
      </div>

      <Tooltip title="Sair do sistema">
        <IconButton onClick={() => signOut()}>
          <SignOut size={25} />
        </IconButton>
      </Tooltip>
    </Container>
  )
}
