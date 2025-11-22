"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlertTriangle, Info, CheckCircle2, Trash2, HelpCircle } from "lucide-react"

type ConfirmVariant = "default" | "delete" | "warning" | "info" | "success"

interface ConfirmDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => Promise<void> | void
  variant?: ConfirmVariant
  disabled?: boolean
  loading?: boolean
  /** Optional trigger content. If provided, uncontrolled open state will be used. */
  trigger?: React.ReactNode
  /** Autofocus confirm button instead of cancel. */
  autoFocusConfirm?: boolean
  className?: string
}

const variantConfig: Record<
  ConfirmVariant,
  {
    icon: React.ElementType
    colorClasses: string
    confirmVariant: "destructive" | "default" | "outline"
  }
> = {
  default: {
    icon: HelpCircle,
    colorClasses: "text-foreground",
    confirmVariant: "default",
  },
  delete: {
    icon: Trash2,
    colorClasses: "text-destructive",
    confirmVariant: "destructive",
  },
  warning: {
    icon: AlertTriangle,
    colorClasses: "text-yellow-500 dark:text-yellow-400",
    confirmVariant: "default",
  },
  info: {
    icon: Info,
    colorClasses: "text-blue-500 dark:text-blue-400",
    confirmVariant: "default",
  },
  success: {
    icon: CheckCircle2,
    colorClasses: "text-green-600 dark:text-green-500",
    confirmVariant: "default",
  },
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const {
    open: controlledOpen,
    onOpenChange,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    variant = "default",
    disabled,
    loading,
    trigger,
    autoFocusConfirm,
    className,
  } = props

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const [internalLoading, setInternalLoading] = React.useState(false)
  const isLoading = loading ?? internalLoading

  const Icon = variantConfig[variant].icon

  const handleOpenChange = (next: boolean) => {
    if (isControlled) {
      onOpenChange?.(next)
    } else {
      setUncontrolledOpen(next)
    }
  }

  const handleConfirm = async () => {
    if (!onConfirm) {
      handleOpenChange(false)
      return
    }
    try {
      setInternalLoading(true)
      await onConfirm()
      handleOpenChange(false)
    } finally {
      setInternalLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn("sm:max-w-[420px]", className)}>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span className={cn("mt-1", variantConfig[variant].colorClasses)}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="space-y-2">
              <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={disabled || isLoading} autoFocus={!autoFocusConfirm}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={variantConfig[variant].confirmVariant}
            onClick={handleConfirm}
            disabled={disabled || isLoading}
            autoFocus={autoFocusConfirm}
          >
            {isLoading ? "Working..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Imperative hook for quick confirms in client components
// Usage:
// const confirm = useConfirm();
// const ok = await confirm({ title: 'Delete item?', variant: 'delete' });
// if (ok) { ... }
interface UseConfirmOptions extends Omit<ConfirmDialogProps, "open" | "onOpenChange" | "trigger"> {}

export function useConfirm() {
  const [options, setOptions] = React.useState<UseConfirmOptions | null>(null)
  const [promiseHandlers, setPromiseHandlers] = React.useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = React.useCallback((opts: UseConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setOptions(opts)
      setPromiseHandlers({ resolve })
    })
  }, [])

  const handleClose = React.useCallback(() => {
    setOptions(null)
    setPromiseHandlers(null)
  }, [])

  const handleConfirm = React.useCallback(async () => {
    if (!promiseHandlers) return
    try {
      if (options?.onConfirm) {
        await options.onConfirm()
      }
      promiseHandlers.resolve(true)
    } catch {
      promiseHandlers.resolve(false)
    } finally {
      handleClose()
    }
  }, [promiseHandlers, options, handleClose])

  const handleCancel = React.useCallback(() => {
    if (promiseHandlers) promiseHandlers.resolve(false)
    handleClose()
  }, [promiseHandlers, handleClose])

  const dialog = options ? (
    <Dialog
      open
      onOpenChange={(o) => {
        if (!o) handleCancel()
      }}
    >
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span className={cn("mt-1", variantConfig[options.variant || "default"].colorClasses)}>
              {React.createElement(variantConfig[options.variant || "default"].icon, { className: "h-5 w-5" })}
            </span>
            <div className="space-y-2">
              <DialogTitle>{options.title || "Are you sure?"}</DialogTitle>
              {options.description && <DialogDescription>{options.description}</DialogDescription>}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={options.disabled}>
            {options.cancelLabel || "Cancel"}
          </Button>
          <Button
            type="button"
            variant={variantConfig[options.variant || "default"].confirmVariant}
            onClick={handleConfirm}
            disabled={options.disabled}
          >
            {options.confirmLabel || "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : null

  return { confirm, dialog }
}

// Convenience specialized components
interface DeleteConfirmProps extends Omit<ConfirmDialogProps, "variant"> {}
export function DeleteConfirmDialog(props: DeleteConfirmProps) {
  return <ConfirmDialog variant="delete" confirmLabel={props.confirmLabel || "Delete"} {...props} />
}

interface WarningConfirmProps extends Omit<ConfirmDialogProps, "variant"> {}
export function WarningConfirmDialog(props: WarningConfirmProps) {
  return <ConfirmDialog variant="warning" confirmLabel={props.confirmLabel || "Proceed"} {...props} />
}

interface InfoConfirmProps extends Omit<ConfirmDialogProps, "variant"> {}
export function InfoConfirmDialog(props: InfoConfirmProps) {
  return <ConfirmDialog variant="info" confirmLabel={props.confirmLabel || "OK"} {...props} />
}

interface SuccessConfirmProps extends Omit<ConfirmDialogProps, "variant"> {}
export function SuccessConfirmDialog(props: SuccessConfirmProps) {
  return <ConfirmDialog variant="success" confirmLabel={props.confirmLabel || "Continue"} {...props} />
}
