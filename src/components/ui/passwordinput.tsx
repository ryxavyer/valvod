'use client'
import * as React from "react"

import { cn } from "@src/lib/utils"
import { Button } from "./button"
import { Eye, EyeOff } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [show, setShow] = React.useState(false)
    return (
      <div className={cn(
        "flex flex-row items-center h-10",
        className
      )}>
        <input
          type={show ? "text" : "password"}
          className="flex h-full w-full mr-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="default"
          className="w-2"
          onClick={() => setShow(!show)}
        >
          {show ? <Eye className="w-4 h-4 shrink-0 opacity-100" /> : <EyeOff className="w-4 h-4 shrink-0 opacity-100" />}
        </Button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
