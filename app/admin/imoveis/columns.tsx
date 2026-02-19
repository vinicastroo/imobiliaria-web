"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Eye, EyeOff, Trash2, Star, StarOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export interface Property {
  id: string
  name: string
  value: string
  slug: string
  city: string
  neighborhood: string
  street: string
  visible: boolean
  highlighted: boolean
  type_property: {
    description: string
  }
}

interface ColumnsProps {
  onToggleStatus: (id: string, currentStatus: boolean) => void
  onToggleHighlighted: (id: string, currentHighlighted: boolean) => void
  onDelete: (id: string) => void
}

// Função para criar colunas injetando funções de ação
export const getColumns = ({ onToggleStatus, onToggleHighlighted, onDelete }: ColumnsProps): ColumnDef<Property>[] => [
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => <span className="text-xs text-blue-900 font-bold px-3 py-2 rounded-full">{row.getValue("code")}</span>,
  },
  {
    accessorKey: "highlighted",
    header: "",
    cell: ({ row }) => row.getValue("highlighted")
      ? <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      : null,
  },
  {
    accessorKey: "type_property.description",
    header: "Tipo",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "value",
    header: "Valor",
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <div className="max-w-[150px] overflow-x-hidden px-2 py-1 rounded">
        <span className="text-xs text-gray-500 ">{row.getValue("slug")}</span>
      </div>
    ),
  },

  {
    accessorKey: "city",
    header: "Cidade",
  },
  {
    accessorKey: "neighborhood",
    header: "Bairro",
  },
  {
    accessorKey: "visible",
    header: "Situação",
    cell: ({ row }) => {
      const isVisible = row.getValue("visible")
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isVisible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isVisible ? 'Ativo' : 'Inativo'}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const property = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>

            <DropdownMenuItem asChild>
              <Link href={`/admin/imoveis/editar/${property.id}`} className="flex items-center cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onToggleStatus(property.id, property.visible)}>
              {property.visible ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" /> Desativar
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" /> Ativar
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onToggleHighlighted(property.id, property.highlighted)}>
              {property.highlighted ? (
                <>
                  <StarOff className="mr-2 h-4 w-4" /> Remover destaque
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" /> Destacar
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => onDelete(property.id)}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]