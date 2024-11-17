"use client"

import * as React from 'react'
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { Button } from "./button"

type SidebarContextType = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = React.useState(true)
  
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export const Sidebar = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex h-full flex-col", className)}
      {...props}
    />
  )
}

export const SidebarContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex-1 overflow-auto", className)}
      {...props}
    />
  )
}

export const SidebarGroup = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("space-y-2 py-2", className)}
      {...props}
    />
  )
}

export const SidebarGroupLabel = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("px-4 text-sm font-semibold", className)}
      {...props}
    />
  )
}

export const SidebarGroupContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("space-y-1", className)}
      {...props}
    />
  )
}

export const SidebarMenu = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("space-y-1", className)}
      {...props}
    />
  )
}

export const SidebarMenuItem = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("px-2", className)}
      {...props}
    />
  )
}

export const SidebarMenuButton = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
        "hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-primary)]",
        className
      )}
      {...props}
    />
  )
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar()
  
  return (
    <div className="p-4 border-b">
      {isOpen && children}
    </div>
  )
}

export function SidebarTrigger() {
  const { isOpen, setIsOpen } = useSidebar()
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsOpen(!isOpen)}
      className="lg:hidden"
    >
      <Menu className="h-6 w-6" />
    </Button>
  )
}

export const SidebarFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("mt-auto", className)}
      {...props}
    />
  )
}

export function SidebarInset({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar()
  
  return (
    <div
      className={cn(
        "transition-[margin] duration-300 ease-in-out",
        isOpen ? "lg:ml-0" : "lg:ml-0",
        className
      )}
      {...props}
    />
  )
}
