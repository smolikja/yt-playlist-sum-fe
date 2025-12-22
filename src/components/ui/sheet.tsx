import * as React from "react"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

const Sheet = ({ open, onOpenChange, children }: SheetProps) => {
  // Lock body scroll when sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: "linear", duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-[60] h-full w-3/4 gap-4 border-r border-neutral-800 bg-black shadow-2xl sm:max-w-sm overflow-hidden"
          >
            {children}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
            >
              <X className="h-4 w-4 text-neutral-400" />
              <span className="sr-only">Close</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const SheetTrigger = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => {
  return <div onClick={onClick}>{children}</div>
}

const SheetContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div className={cn("h-full w-full flex flex-col overflow-hidden", className)}>{children}</div>
}

const SheetHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}>{children}</div>
}

const SheetTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div className={cn("text-lg font-semibold text-neutral-200", className)}>{children}</div>
}

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle }
