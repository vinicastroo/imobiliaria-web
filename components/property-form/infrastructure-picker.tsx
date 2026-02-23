"use client"

import { useState } from "react"
import { Plus, Loader2, X } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import api from "@/services/api"
import type { Infrastructure } from "@/hooks/use-infrastructures"

interface InfrastructurePickerProps {
  items: Infrastructure[]
  selected: string[]
  onChange: (ids: string[]) => void
}

export function InfrastructurePicker({ items, selected, onChange }: InfrastructurePickerProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const selectedItems = items.filter((item) => selected.includes(item.id))
  const unselectedItems = items.filter((item) => !selected.includes(item.id))

  function handleRemove(id: string) {
    onChange(selected.filter((selectedId) => selectedId !== id))
  }

  async function handleCreate() {
    const trimmed = name.trim()
    if (!trimmed) return

    setIsSaving(true)
    try {
      const res = await api.post<Infrastructure>("/infraestrutura", { name: trimmed })
      await queryClient.invalidateQueries({ queryKey: ["infrastructures"] })
      onChange([...selected, res.data.id])
      setName("")
      toast.success("Item criado e selecionado!")
    } catch {
      toast.error("Erro ao criar item")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {selectedItems.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-1 rounded-full border border-primary bg-primary px-3 py-1 text-sm font-medium text-primary-foreground"
          >
            {item.name}
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="ml-0.5 rounded-full p-0.5 hover:bg-primary-foreground/20 transition-colors"
              aria-label={`Remover ${item.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="rounded-full px-4 border-dashed text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          {selectedItems.length === 0 ? "Adicionar infraestrutura" : "Adicionar"}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); setName("") }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Infraestrutura</DialogTitle>
          </DialogHeader>

          {unselectedItems.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground -mt-2">
                Clique para adicionar ao imóvel ou crie um novo abaixo.
              </p>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto py-1">
                {unselectedItems.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onChange([...selected, item.id])}
                    className="rounded-full px-4"
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
              <Separator />
            </>
          ) : items.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground -mt-2">
                Todos os itens já foram selecionados. Crie um novo abaixo.
              </p>
              <Separator />
            </>
          ) : null}

          <div className="flex gap-2">
            <Input
              placeholder="Nome do novo item..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus={items.length === 0}
            />
            <Button
              type="button"
              onClick={handleCreate}
              disabled={isSaving || !name.trim()}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
