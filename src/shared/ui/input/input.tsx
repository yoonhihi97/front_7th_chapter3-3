import { forwardRef, ReactNode } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftAddon?: ReactNode
  rightAddon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftAddon, rightAddon, ...props }, ref) => {
    const hasAddon = leftAddon || rightAddon

    if (hasAddon) {
      const paddingClass = `${leftAddon ? "pl-8" : "pl-3"} ${rightAddon ? "pr-8" : "pr-3"}`

      return (
        <div className="relative">
          {leftAddon && (
            <div className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground">
              {leftAddon}
            </div>
          )}
          <input
            type={type}
            className={`flex h-10 w-full rounded-md border border-input bg-white ${paddingClass} py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            ref={ref}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground">
              {rightAddon}
            </div>
          )}
        </div>
      )
    }

    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"
