/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Menu } from './styles'

import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBold'
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalic'
import FormatStrikethroughOutlinedIcon from '@mui/icons-material/FormatStrikethrough'
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumbered'
import FormatAlignLeftOutlinedIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterOutlinedIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignJustifyOutlinedIcon from '@mui/icons-material/FormatAlignJustify'
import FormatAlignRightOutlinedIcon from '@mui/icons-material/FormatAlignRight'
import UndoOutlinedIcon from '@mui/icons-material/Undo'
import RedoOutlinedIcon from '@mui/icons-material/Redo'
import { Box, IconButton } from '@mui/material'

export default function MenuBar({ editor }: { editor: any }) {
  if (!editor) {
    return null
  }

  return (
    <Menu>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 1,
          px: 1,
          borderRight: '1px solid #c7c7c7',
          flex: 1,
        }}
      >
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          <FormatBoldOutlinedIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          <FormatItalicOutlinedIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          <FormatStrikethroughOutlinedIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 1,
          px: 1,
          borderRight: '1px solid #c7c7c7',
          flex: 1,
        }}
      >
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          <FormatListBulletedOutlinedIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          <FormatListNumberedOutlinedIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 1,
          px: 1,
          borderRight: '1px solid #c7c7c7',
          flex: 1,
        }}
      >
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
        >
          <FormatAlignLeftOutlinedIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={
            editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''
          }
        >
          <FormatAlignCenterOutlinedIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
        >
          <FormatAlignRightOutlinedIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={
            editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''
          }
        >
          <FormatAlignJustifyOutlinedIcon />
        </IconButton>
      </Box>

      {/* <IconButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <HorizontalRuleOutlinedIcon />
        </IconButton> */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 1,
          px: 1,
          flex: 1,
        }}
      >
        <IconButton onClick={() => editor.chain().focus().undo().run()}>
          <UndoOutlinedIcon />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().redo().run()}>
          <RedoOutlinedIcon />
        </IconButton>
      </Box>
    </Menu>
  )
}
