"use client"

import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Minus
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils' // Utilitário padrão do shadcn

interface MenuBarProps {
  editor: Editor | null
}

const MenuButton = ({
  action,
  isActive = false,
  icon: Icon,
  title
}: {
  action: () => void,
  isActive?: boolean,
  icon: React.ElementType,
  title: string
}) => (
  <Button
    onClick={(e) => {
      e.preventDefault() // Evita submit do form se estiver dentro de um
      action()
    }}
    variant="ghost"
    size="sm"
    className={cn(
      "h-8 w-8 p-0 data-[active=true]:bg-muted data-[active=true]:text-[#17375F]",
      isActive && "bg-slate-200 text-[#17375F]"
    )}
    title={title}
    type="button"
  >
    <Icon className="h-4 w-4" />
  </Button>
)

export function MenuBarTiptap({ editor }: MenuBarProps) {
  if (!editor) {
    return null
  }

  // Helper para renderizar botões de forma consistente


  return (
    <div className="flex flex-wrap items-center gap-1 p-1 border-b bg-gray-50/50 rounded-t-md">

      {/* Grupo: Histórico */}
      <div className="flex items-center gap-1">
        <MenuButton
          action={() => editor.chain().focus().undo().run()}
          icon={Undo}
          title="Desfazer"
        />
        <MenuButton
          action={() => editor.chain().focus().redo().run()}
          icon={Redo}
          title="Refazer"
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Grupo: Formatação Básica */}
      <div className="flex items-center gap-1">
        <MenuButton
          action={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={Bold}
          title="Negrito"
        />
        <MenuButton
          action={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={Italic}
          title="Itálico"
        />
        <MenuButton
          action={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={Strikethrough}
          title="Tachado"
        />
        <MenuButton
          action={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          icon={Code}
          title="Código"
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Grupo: Cabeçalhos */}
      <div className="flex items-center gap-1">
        <MenuButton
          action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          icon={Heading1}
          title="H1"
        />
        <MenuButton
          action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
          title="H2"
        />
        <MenuButton
          action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          icon={Heading3}
          title="H3"
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Grupo: Alinhamento (Requer @tiptap/extension-text-align) */}
      <div className="flex items-center gap-1">
        <MenuButton
          action={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          icon={AlignLeft}
          title="Esquerda"
        />
        <MenuButton
          action={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          icon={AlignCenter}
          title="Centro"
        />
        <MenuButton
          action={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          icon={AlignRight}
          title="Direita"
        />
        <MenuButton
          action={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          icon={AlignJustify}
          title="Justificado"
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Grupo: Listas e Blocos */}
      <div className="flex items-center gap-1">
        <MenuButton
          action={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={List}
          title="Lista com marcadores"
        />
        <MenuButton
          action={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={ListOrdered}
          title="Lista numerada"
        />
        <MenuButton
          action={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={Quote}
          title="Citação"
        />
        <MenuButton
          action={() => editor.chain().focus().setHorizontalRule().run()}
          icon={Minus}
          title="Linha Horizontal"
        />
      </div>
    </div>
  )
}