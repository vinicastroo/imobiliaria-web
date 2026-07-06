"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, BellRing, Check, CheckCheck } from 'lucide-react'

import api from '@/services/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface AppNotification {
  id: string
  type: 'NEW_LEAD' | 'CLIENT_ASSIGNED' | 'FOLLOW_UP_DUE'
  title: string
  body: string | null
  link: string | null
  readAt: string | null
  createdAt: string
}

interface NotificationsResponse {
  notifications: AppNotification[]
  unreadCount: number
}

const MODAL_SNOOZE_KEY = 'notifications-modal-snoozed-until'
const MODAL_SNOOZE_MS = 24 * 60 * 60 * 1000

function relativeTime(isoString: string): string {
  const diffMinutes = Math.floor((Date.now() - new Date(isoString).getTime()) / 60_000)
  if (diffMinutes < 1) return 'agora'
  if (diffMinutes < 60) return `há ${diffMinutes} min`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `há ${diffHours} h`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'ontem'
  if (diffDays < 7) return `há ${diffDays} dias`

  return new Date(isoString).toLocaleDateString('pt-BR')
}

export function NotificationsBell({ isExpanded }: { isExpanded: boolean }) {
  const [open, setOpen] = useState(false)
  // true quando a modal já foi fechada nesta sessão ou o "Ver depois" ainda está valendo
  const [modalHidden, setModalHidden] = useState(() =>
    typeof window === 'undefined'
      ? true
      : Number(localStorage.getItem(MODAL_SNOOZE_KEY) ?? 0) > Date.now(),
  )
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  const enabled = !!session?.user?.agencyId

  const { data } = useQuery<NotificationsResponse>({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/notifications')).data,
    enabled,
    refetchInterval: 30_000,
  })

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/notifications/${id}/read`),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const readAllMutation = useMutation({
    mutationFn: async () => api.patch('/notifications/read-all'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  if (!enabled) return null

  const notifications = data?.notifications ?? []
  const unreadCount = data?.unreadCount ?? 0

  const modalOpen = unreadCount > 0 && !modalHidden

  const handleViewNotifications = () => {
    setModalHidden(true)
    setOpen(true)
  }

  const handleSnoozeModal = () => {
    localStorage.setItem(MODAL_SNOOZE_KEY, String(Date.now() + MODAL_SNOOZE_MS))
    setModalHidden(true)
  }

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.readAt) {
      markReadMutation.mutate(notification.id)
    }
    if (notification.link) {
      setOpen(false)
      router.push(notification.link)
    }
  }

  const trigger = (
    <PopoverTrigger asChild>
      <button
        type="button"
        className={cn(
          'flex h-10 w-full select-none items-center rounded-lg text-sm text-white/65 transition-all duration-150 hover:bg-white/10 hover:text-white',
          isExpanded ? 'gap-3 px-3' : 'justify-center px-0',
        )}
      >
        <span className="relative shrink-0">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -right-1.5 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </span>
        <span
          className={cn(
            'overflow-hidden whitespace-nowrap transition-all duration-300',
            isExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0',
          )}
        >
          Notificações
        </span>
      </button>
    </PopoverTrigger>
  )

  return (
    <>
      <Dialog open={modalOpen} onOpenChange={(isOpen) => { if (!isOpen) setModalHidden(true) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BellRing className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center">
              {unreadCount === 1
                ? 'Você tem 1 notificação não lida'
                : `Você tem ${unreadCount} notificações não lidas`}
            </DialogTitle>
            <DialogDescription className="text-center">
              Novos leads, clientes atribuídos e follow-ups podem estar esperando por você.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button className="w-full bg-[#17375F] hover:bg-[#122b4a]" onClick={handleViewNotifications}>
              Ver notificações
            </Button>
            <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleSnoozeModal}>
              Ver depois
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Popover open={open} onOpenChange={setOpen}>
      {isExpanded ? (
        trigger
      ) : (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
            <TooltipContent side="right" className="text-xs">Notificações</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <PopoverContent side="right" align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3.5 py-2.5">
          <p className="text-sm font-semibold">Notificações</p>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
              disabled={readAllMutation.isPending}
              onClick={() => readAllMutation.mutate()}
            >
              <CheckCheck size={13} /> Marcar todas
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <Bell size={20} className="text-gray-300" />
            <p className="text-xs text-muted-foreground">Nenhuma notificação por aqui</p>
          </div>
        ) : (
          <div className="thin-scrollbar max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                role="button"
                tabIndex={0}
                onClick={() => handleNotificationClick(notification)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNotificationClick(notification) }}
                className={cn(
                  'group flex w-full cursor-pointer items-start gap-2.5 border-b px-3.5 py-3 text-left transition-colors last:border-0 hover:bg-gray-50',
                  !notification.readAt && 'bg-primary/[0.04]',
                )}
              >
                <span
                  className={cn(
                    'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                    notification.readAt ? 'bg-transparent' : 'bg-primary',
                  )}
                />
                <span className={cn('min-w-0 flex-1', notification.readAt && 'opacity-55')}>
                  <span
                    className={cn(
                      'block text-xs text-foreground',
                      notification.readAt ? 'font-normal' : 'font-medium',
                    )}
                  >
                    {notification.title}
                  </span>
                  {notification.body && (
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {notification.body}
                    </span>
                  )}
                  <span className="mt-1 block text-[11px] text-muted-foreground/70">
                    {relativeTime(notification.createdAt)}
                  </span>
                </span>
                {!notification.readAt && (
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          disabled={markReadMutation.isPending}
                          onClick={(e) => {
                            e.stopPropagation()
                            markReadMutation.mutate(notification.id)
                          }}
                          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground/50 opacity-0 transition-all hover:bg-primary/10 hover:text-primary group-hover:opacity-100 focus-visible:opacity-100"
                        >
                          <Check size={14} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="text-xs">Marcar como lida</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
    </>
  )
}
