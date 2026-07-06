"use client"

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Check, Loader2, Trash2 } from 'lucide-react'
import { AxiosError } from 'axios'

import api from '@/services/api'
import { STAGE_COLORS, type ClientStage, type StageColorKey } from '@/components/crm-stage-colors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface CrmStageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stageToEdit?: ClientStage | null
}

function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError && typeof error.response?.data?.message === 'string') {
    return error.response.data.message
  }
  return fallback
}

export function CrmStageDialog({ open, onOpenChange, stageToEdit }: CrmStageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <CrmStageDialogContent
          key={stageToEdit?.id ?? 'new'}
          onOpenChange={onOpenChange}
          stageToEdit={stageToEdit}
        />
      )}
    </Dialog>
  )
}

function CrmStageDialogContent({
  onOpenChange,
  stageToEdit,
}: Pick<CrmStageDialogProps, 'onOpenChange' | 'stageToEdit'>) {
  const queryClient = useQueryClient()
  const [name, setName] = useState(stageToEdit?.name ?? '')
  const [color, setColor] = useState<StageColorKey>(
    (stageToEdit?.color as StageColorKey) ?? 'blue'
  )

  const isDefaultStage = !!stageToEdit?.systemKey
  const clientCount = stageToEdit?._count?.clients ?? 0

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { name: name.trim(), color }
      if (stageToEdit) {
        await api.put(`/crm-stages/${stageToEdit.id}`, payload)
      } else {
        await api.post('/crm-stages', payload)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-stages'] })
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] })
      toast.success(stageToEdit ? 'Coluna atualizada!' : 'Coluna criada!')
      onOpenChange(false)
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao salvar coluna')),
  })

  const deleteMutation = useMutation({
    mutationFn: async () => api.delete(`/crm-stages/${stageToEdit!.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-stages'] })
      toast.success('Coluna excluída')
      onOpenChange(false)
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao excluir coluna')),
  })

  const isPending = saveMutation.isPending || deleteMutation.isPending

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{stageToEdit ? 'Editar' : 'Nova'} coluna</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Nome <span className="text-red-500">*</span></Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Proposta, Fechado..."
            maxLength={30}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label>Cor</Label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(STAGE_COLORS) as [StageColorKey, typeof STAGE_COLORS[StageColorKey]][]).map(
              ([key, config]) => (
                <button
                  key={key}
                  type="button"
                  title={config.label}
                  onClick={() => setColor(key)}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110',
                    config.dot,
                    color === key && 'ring-2 ring-offset-2 ring-gray-400',
                  )}
                >
                  {color === key && <Check className="h-4 w-4 text-white" />}
                </button>
              )
            )}
          </div>
        </div>

        {isDefaultStage && (
          <p className="text-xs text-muted-foreground">
            Esta é uma coluna padrão do CRM — pode ser renomeada e recolorida, mas não excluída.
          </p>
        )}
      </div>

      <DialogFooter className="gap-2 sm:justify-between">
        <div>
          {stageToEdit && !isDefaultStage && (
            <Button
              variant="destructive"
              disabled={isPending || clientCount > 0}
              title={clientCount > 0 ? 'Mova os contatos desta coluna antes de excluí-la' : undefined}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending
                ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
                : <Trash2 className="h-4 w-4 mr-2" />}
              Excluir
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={isPending || !name.trim()}
            onClick={() => saveMutation.mutate()}
          >
            {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Salvar
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  )
}
