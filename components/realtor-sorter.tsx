"use client"

import { ArrowUp, ArrowDown, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// 1. Importar componentes de Avatar
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Realtor {
  id: string
  name: string
  avatar?: string // 2. Adicionado campo opcional para foto
}

interface RealtorSorterProps {
  allRealtors: Realtor[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function RealtorSorter({ allRealtors, selectedIds, onChange }: RealtorSorterProps) {
  const selectedRealtors = selectedIds
    .map(id => allRealtors.find(r => r.id === id))
    .filter(Boolean) as Realtor[]

  const handleAdd = (id: string) => {
    if (!selectedIds.includes(id)) {
      onChange([...selectedIds, id])
    }
  }

  const handleRemove = (id: string) => {
    onChange(selectedIds.filter(itemId => itemId !== id))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newIds = [...selectedIds]
    const temp = newIds[index]
    newIds[index] = newIds[index - 1]
    newIds[index - 1] = temp
    onChange(newIds)
  }

  const moveDown = (index: number) => {
    if (index === selectedIds.length - 1) return
    const newIds = [...selectedIds]
    const temp = newIds[index]
    newIds[index] = newIds[index + 1]
    newIds[index + 1] = temp
    onChange(newIds)
  }

  return (
    <div className="space-y-4 rounded-md">
      <div className="space-y-2">
        <label className="text-sm font-medium">Adicionar Corretor</label>

        <Select onValueChange={handleAdd}>
          <SelectTrigger className="h-12"> {/* Aumentei um pouco a altura para caber a foto */}
            <SelectValue placeholder="Selecione para adicionar..." />
          </SelectTrigger>
          <SelectContent>
            {allRealtors
              .filter(r => !selectedIds.includes(r.id))
              .map(r => (
                <SelectItem key={r.id} value={r.id}>
                  {/* 3. Layout Flex para Foto + Nome dentro do Select */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={r.avatar} alt={r.name} />
                      <AvatarFallback className="text-[10px]">
                        {r.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{r.name}</span>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Ordem de Exibição (Topo = Primeiro)</label>
        {selectedRealtors.length === 0 && (
          <p className="text-sm text-gray-400 italic">Nenhum selecionado.</p>
        )}

        {selectedRealtors.map((realtor, index) => (
          <div key={realtor.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
            <span className="flex items-center gap-3">
              <Badge variant="outline" className="w-6 h-6 flex justify-center p-0">{index + 1}</Badge>

              {/* 4. Exibindo a foto também na lista de ordenação */}
              <Avatar className="h-8 w-8 border bg-white">
                <AvatarImage src={realtor.avatar} alt={realtor.name} />
                <AvatarFallback><User size={14} /></AvatarFallback>
              </Avatar>

              <span className="font-medium text-sm">{realtor.name}</span>
            </span>

            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" type="button" className="h-8 w-8" onClick={() => moveUp(index)} disabled={index === 0}>
                <ArrowUp size={14} />
              </Button>
              <Button size="icon" variant="ghost" type="button" className="h-8 w-8" onClick={() => moveDown(index)} disabled={index === selectedRealtors.length - 1}>
                <ArrowDown size={14} />
              </Button>
              <Button size="icon" variant="ghost" type="button" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleRemove(realtor.id)}>
                <X size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}