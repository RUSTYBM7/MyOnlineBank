import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, ChevronUp, ChevronDown, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface EnterpriseModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
  size?: "sm" | "md" | "lg" | "xl" | "full" | "auto" | "form"
  position?: "center" | "top" | "bottom"
  preventClose?: boolean
  title?: string
  subtitle?: string
  showScrollNav?: boolean
  fixedFooter?: boolean
  footerContent?: React.ReactNode
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md sm:max-w-md",
  lg: "max-w-lg sm:max-w-lg",
  xl: "max-w-xl sm:max-w-xl",
  full: "max-w-[100vw] sm:max-w-[95vw] max-h-[100vh] sm:max-h-[95vh]",
  auto: "max-w-auto",
  form: "max-w-lg sm:max-w-lg"
}

// Dynamic height calculation - ensures footer is always visible
const mobileHeightClass = "h-[95vh] max-h-[95vh] sm:h-[90vh] sm:max-h-[90vh]"
const desktopHeightClass = "sm:max-h-[85vh]"

// Mobile-first positioning
const positionClasses = {
  center: "bottom-0 sm:top-1/2 sm:-translate-y-1/2 left-0 sm:left-1/2 sm:-translate-x-1/2",
  top: "top-0 sm:top-[5%] left-0 sm:left-1/2 sm:-translate-x-1/2",
  bottom: "bottom-0 left-0 sm:left-1/2 sm:-translate-x-1/2"
}

export function EnterpriseModal({
  open,
  onOpenChange,
  children,
  className,
  showCloseButton = true,
  size = "md",
  position = "center",
  preventClose = false,
  title,
  subtitle,
  showScrollNav = true,
  fixedFooter = true,
  footerContent
}: EnterpriseModalProps) {
  const [isOpen, setIsOpen] = React.useState(open ?? false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [canScrollUp, setCanScrollUp] = React.useState(false)
  const [canScrollDown, setCanScrollDown] = React.useState(false)
  const [isAtTop, setIsAtTop] = React.useState(true)
  const [isAtBottom, setIsAtBottom] = React.useState(false)

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  // Lock body scroll and manage safe areas - Mobile optimized
  React.useEffect(() => {
    if (isOpen) {
      // Save scroll position for restoration
      const scrollY = window.scrollY
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
      document.body.style.paddingRight = "0px"
      // Store scroll position on the element for retrieval
      document.body.dataset.scrollY = String(scrollY)
      // Dispatch custom event for parent components to detect modal state
      window.dispatchEvent(new CustomEvent('modalOpen'))
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || '0', 10)
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.paddingRight = ""
      // Restore scroll position
      window.scrollTo(0, scrollY)
      // Dispatch custom event for parent components to detect modal state
      window.dispatchEvent(new CustomEvent('modalClose'))
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.paddingRight = ""
    }
  }, [isOpen])

  // Check scroll position
  const checkScroll = React.useCallback(() => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      setCanScrollUp(scrollTop > 0)
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 5)
      setIsAtTop(scrollTop === 0)
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 5)
    }
  }, [])

  React.useEffect(() => {
    if (isOpen) {
      checkScroll()
      const content = contentRef.current
      if (content) {
        content.addEventListener('scroll', checkScroll)
        window.addEventListener('resize', checkScroll)
        return () => {
          content.removeEventListener('scroll', checkScroll)
          window.removeEventListener('resize', checkScroll)
        }
      }
    }
  }, [isOpen, checkScroll])

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (preventClose && !newOpen) return
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }, [preventClose, onOpenChange])

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Calculate max height based on screen size - Mobile optimized
  const getMaxHeight = () => {
    if (isFullscreen) return "100vh"
    // Mobile uses 90vh, desktop uses 85vh
    return `max(90vh, calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 20px))`
  }

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            {/* Overlay - Mobile optimized with touch support */}
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] bg-black/60 sm:bg-black/70 backdrop-blur-md touch-none"
                aria-hidden="true"
                onClick={() => !preventClose && handleOpenChange(false)}
              />
            </DialogPrimitive.Overlay>

            {/* Modal Content - Mobile-first responsive design */}
            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  // Mobile: full width at bottom, Desktop: centered
                  "fixed z-[101] w-full sm:w-auto",
                  positionClasses[position],
                  sizeClasses[size],
                  // Mobile: no rounded corners at top, Desktop: rounded
                  "rounded-t-3xl sm:rounded-3xl rounded-b-0 sm:rounded-b-3xl",
                  "bg-white/95 backdrop-blur-2xl shadow-2xl",
                  "border border-emerald-100/50 sm:border",
                  "focus:outline-none",
                  "flex flex-col",
                  // Dynamic height - mobile uses 95vh, desktop uses 85vh
                  "h-[92vh] max-h-[92vh] sm:h-[88vh] sm:max-h-[88vh]",
                  "overflow-hidden",
                  className
                )}
              >
                {/* Header with Scroll Navigation - Mobile optimized */}
                <div className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-5 pb-2 sm:pb-3 border-b border-emerald-100/50 bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {title && (
                        <DialogPrimitive.Title className="text-lg font-bold text-gray-900 truncate">
                          {title}
                        </DialogPrimitive.Title>
                      )}
                      {subtitle && (
                        <DialogPrimitive.Description className="text-xs text-gray-500 mt-0.5">
                          {subtitle}
                        </DialogPrimitive.Description>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 ml-3">
                      {/* Scroll Navigation */}
                      {showScrollNav && (canScrollUp || canScrollDown) && (
                        <div className="flex items-center gap-0.5 bg-emerald-50 rounded-full px-1.5 py-1">
                          <button
                            onClick={scrollToTop}
                            disabled={isAtTop}
                            className={cn(
                              "p-1 rounded-full transition-all",
                              canScrollUp && !isAtTop
                                ? "hover:bg-emerald-100 text-emerald-600"
                                : "text-gray-300 cursor-not-allowed"
                            )}
                            title="Scroll to top"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={scrollToBottom}
                            disabled={isAtBottom}
                            className={cn(
                              "p-1 rounded-full transition-all",
                              canScrollDown && !isAtBottom
                                ? "hover:bg-emerald-100 text-emerald-600"
                                : "text-gray-300 cursor-not-allowed"
                            )}
                            title="Scroll to bottom"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Fullscreen Toggle */}
                      <button
                        onClick={toggleFullscreen}
                        className="p-1.5 rounded-full hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-all"
                        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-4 h-4" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </button>

                      {/* Close Button */}
                      {showCloseButton && !preventClose && (
                        <DialogPrimitive.Close className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                          <X className="w-4 h-4" />
                          <span className="sr-only">Close</span>
                        </DialogPrimitive.Close>
                      )}
                    </div>
                  </div>

                  {/* Scroll Progress Indicator */}
                  {showScrollNav && (canScrollUp || canScrollDown) && (
                    <div className="mt-2 h-0.5 bg-emerald-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-150"
                        style={{
                          width: contentRef.current
                            ? `${((contentRef.current.scrollTop + contentRef.current.clientHeight) / contentRef.current.scrollHeight) * 100}%`
                            : '100%'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Scrollable Content - Mobile optimized with dynamic height */}
                <div
                  ref={contentRef}
                  className="flex-1 overflow-y-auto overscroll-contain scroll-smooth px-4 sm:px-6 min-h-0"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)'
                  }}
                >
                  {children}
                </div>

                {/* Fixed Footer - Mobile optimized with safe area - Always visible */}
                {fixedFooter && footerContent && (
                  <div
                    className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-emerald-100/50 bg-white/95 backdrop-blur-sm safe-area-bottom"
                    style={{
                      paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)',
                      minHeight: '72px'
                    }}
                  >
                    {footerContent}
                  </div>
                )}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

// Modal Components - Mobile optimized
export function ModalHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-4 sm:px-6 py-3 sm:py-4", className)} {...props}>
      {children}
    </div>
  )
}

export function ModalBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-4 sm:px-6 py-3 sm:py-4", className)} {...props}>
      {children}
    </div>
  )
}

export function ModalFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-4 sm:px-6 py-3 sm:py-4 border-t border-emerald-100/50",
        "flex flex-col gap-3 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function ModalTrigger({ children, ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger asChild {...props}>{children}</DialogPrimitive.Trigger>
}

export default EnterpriseModal
