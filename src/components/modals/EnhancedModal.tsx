import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface EnhancedModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
  size?: "sm" | "md" | "lg" | "xl" | "full" | "auto"
  position?: "center" | "top" | "bottom"
  preventClose?: boolean
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[95vw] max-h-[95vh]",
  auto: "max-w-auto"
}

const positionClasses = {
  center: "top-1/2 -translate-y-1/2",
  top: "top-[5%] -translate-y-0",
  bottom: "top-[10%] sm:top-1/2 sm:-translate-y-1/2"
}

function EnhancedModal({
  open,
  onOpenChange,
  children,
  className,
  showCloseButton = true,
  size = "md",
  position = "center",
  preventClose = false
}: EnhancedModalProps) {
  const [isOpen, setIsOpen] = React.useState(open ?? false)

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.paddingRight = "0px"
    } else {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
  }, [isOpen])

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (preventClose && !newOpen) return
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }, [preventClose, onOpenChange])

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                aria-hidden="true"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: position === "top" ? -20 : 0 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: position === "top" ? -20 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn(
                  "fixed left-1/2 z-50 -translate-x-1/2 w-full",
                  positionClasses[position],
                  sizeClasses[size],
                  "bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl",
                  "border border-emerald-100/50",
                  "focus:outline-none",
                  "max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col",
                  className
                )}
                style={{
                  maxHeight: "calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 20px) - 20px)"
                }}
              >
                {showCloseButton && !preventClose && (
                  <DialogPrimitive.Close className="absolute top-4 right-4 z-10 rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    <X className="w-5 h-5" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                )}
                <div className="flex-1 overflow-y-auto overscroll-contain pb-safe">
                  {children}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

function ModalHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 pt-6 pb-4 border-b border-emerald-100/50", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function ModalTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-xl font-bold text-gray-900", className)} {...props}>
      {children}
    </h2>
  )
}

function ModalDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-gray-500 mt-1", className)} {...props}>
      {children}
    </p>
  )
}

function ModalBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-4 flex-1", className)} {...props}>
      {children}
    </div>
  )
}

function ModalFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-t border-emerald-100/50 bg-gray-50/50",
        "sticky bottom-0",
        "flex flex-col-reverse sm:flex-row sm:justify-end gap-3",
        className
      )}
      style={{
        paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))"
      }}
      {...props}
    >
      {children}
    </div>
  )
}

function ModalTrigger({ children, ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger asChild {...props}>{children}</DialogPrimitive.Trigger>
}

export {
  EnhancedModal as Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalTrigger
}

export default EnhancedModal
