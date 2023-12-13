import { styled } from '@ignite-ui/react'
import { EditorContent } from '@tiptap/react'
import { FilePond } from 'react-filepond'

export const Content = styled('div', {
  width: '100%',
  padding: '$10',
  overflow: 'auto',
})

export const FilePondStyled = styled(FilePond, {
  '.filepond--item': {
    width: 'calc(50% - 0.5em)',
    backgroundSize: 'cover',

    img: {
      width: '100%',
      height: 'auto',
      backgroundSize: 'cover',
      imageRendering: 'pixelated',
      /* Ou use max-width para limitar o tamanho máximo */
      /* max-width: 100%; */
    },
  },

  '@media (min-width: 30em)': {
    '  .filepond--item': {
      width: 'calc(50% - 0.5em)',
    },
  },

  '@media (min-width: 50em)': {
    '.filepond--item': {
      width: 'calc(33.33% - 0.5em)',
    },
  },
})

export const EditorStyled = styled(EditorContent, {
  // border: '1px solid #eee',
  borderTop: '0',
  overflowY: 'auto',
  maxHeight: '400px',
  '>div': {
    padding: '1rem 2rem',
  },

  img: {
    maxWidth: '600px',
  },

  pre: {
    background: '#282a36',
    borderRadius: '0.5rem',
    color: '#fff',
    padding: '0.75rem 1rem',
  },
})
